import { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Label } from "../../../../components/ui/label";
import DataLoading from "../../../../components/Loaders/DataLoading";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";

import { useFormik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { updatePage } from "../../../../api/Admin/FooterApi.js";
import { createPage } from "../../../../api/Admin/FooterApi.js";
import { fetchAllPages } from "../../../../api/Admin/FooterApi.js";
import { deletePage } from "../../../../api/Admin/FooterApi.js";
import { getPageById } from "../../../../api/Admin/FooterApi.js";

const LegalDocs = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const editorContent = useRef(null);

  // Jodit editor config
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      readonly: false,
    }),
    []
  );

  // Slug options
  const slugOptions = [
    "Privacy Policy",
    "Terms And Conditions",
    "Exchange Return And Refund Policy",
    "Shipping Policy",
    "Lifetime Returns and Exchange Policy",
    "Diamond Color Customization Policy",
  ];

  // Form validation schema
  const validationSchema = Yup.object().shape({
    slug: Yup.string().required("Slug is required"),
    content: Yup.string().required("Content is required"),
  });

  // Formik form
  const formik = useFormik({
    initialValues: {
      slug: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;
        if (currentEditId) {
          response = await updatePage(currentEditId, values);
        } else {
          response = await createPage(values);
        }

        if (response.data.success) {
          toast.success(
            `Page ${currentEditId ? "updated" : "created"} successfully`
          );
          setActiveTab("list");
          fetchData();
          formik.resetForm();
        } else {
          toast.error(
            response.data.message ||
              `Failed to ${currentEditId ? "update" : "create"} page`
          );
        }
      } catch (error) {
        console.log("Save error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${currentEditId ? "update" : "create"} page`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchAllPages();
      setPages(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePage = async (id) => {
    try {
      const response = await deletePage(id);
      if (response.data.success) {
        toast.success("Page deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete Page");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Page");
    }
  };

  const openAddForm = () => {
    setCurrentEditId(null);
    formik.resetForm();
    setActiveTab("create");
  };

  const openEditForm = async (id) => {
    try {
      const response = await getPageById(id);
      if (response.data.success) {
        const page = response.data.data;
        setCurrentEditId(id);
        formik.setValues({
          slug: page.slug,
          content: page.content,
        });
        setActiveTab("create");
      } else {
        toast.error(response.data.message || "Failed to fetch page details");
      }
    } catch (error) {
      console.log("Fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch page details"
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">CMS</h2>
          <p className="text-md font-semibold">Important Links</p>
        </div>
      </div>
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 w-full overflow-x-auto py-2 no-scrollbar">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="list">Page List</TabsTrigger>
              <TabsTrigger
                value="create"
                disabled={!currentEditId && activeTab !== "create"}
              >
                {currentEditId ? "Edit Page" : "Create Page"}
              </TabsTrigger>
            </TabsList>
            <Button
              className="flex-shrink-0 addButton truncate bg-Lime flex items-center gap-2"
              onClick={openAddForm}
            >
              <FiPlus /> Create Page
            </Button>
          </div>
        </Tabs>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="list">
          <div className="rounded-xl border">
            <div className="relative mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["S.No", "Slug", "Content", "Created At", "Action"].map(
                      (header) => (
                        <TableHead
                          key={header}
                          className="whitespace-nowrap text-center"
                        >
                          {header}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-20 text-center">
                        <DataLoading />
                      </TableCell>
                    </TableRow>
                  ) : pages?.length > 0 ? (
                    pages.map((item, index) => (
                      <TableRow key={item.id} className="text-center">
                        <TableCell className="min-w-[50px] text-balance">
                          {index + 1}.
                        </TableCell>

                        <TableCell className="min-w-[160px]  text-left ">
                          {item.slug}
                        </TableCell>
                        <TableCell className="min-w-[180px]  text-left">
                          {item.content.length > 100
                            ? `${item.content.substring(0, 100)}...`
                            : item.content}
                          {item.content.length > 100 && (
                            <Button
                              variant="link"
                              className="text-blue-500 p-0 ml-1 h-auto text-xs"
                              onClick={() => openEditForm(item.id)}
                            >
                              Show More
                            </Button>
                          )}
                        </TableCell>

                        <TableCell className="min-w-[140px] text-balance">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="edit"
                              size="sm"
                              onClick={() => openEditForm(item.id)}
                              className="text-xs md:text-sm px-6"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="edit"
                              size="sm"
                              className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl"
                              onClick={() => handleDeletePage(item.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <span className="text-gray-500">
                            No Data Available
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <div className="rounded-xl border p-3 sm:p-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      formik.setFieldValue("slug", value)
                    }
                    value={formik.values.slug}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a slug" />
                    </SelectTrigger>
                    <SelectContent>
                      {slugOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.errors.slug && formik.touched.slug && (
                    <div className="col-span-4 text-red-500 text-sm text-right">
                      {formik.errors.slug}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="content" className="text-right mt-2">
                    Content
                  </Label>
                  <div className="col-span-3">
                    <JoditEditor
                      ref={editorContent}
                      config={config}
                      value={formik.values.content}
                      onBlur={() => formik.setFieldTouched("content", true)}
                      onChange={(newContent) =>
                        formik.setFieldValue("content", newContent)
                      }
                    />
                    {formik.errors.content && formik.touched.content && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("list")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDocs;
