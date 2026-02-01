import React, { useEffect, useState } from "react";
import CurrencyToggle from "../CurrencyToggle/CurrencyToggle";
import {
  getAllPublicCurrencies,
  getPublicShippingCharges,
} from "../../api/Public/publicApi";
import { Skeleton } from "../ui/skeleton";

const TopBar = () => {
  const [shipping, setShipping] = useState(null);
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getPublicShippingCharges();
      setShipping(response.data.data[0]);

      const res = await getAllPublicCurrencies();
      setCurrencyList(res.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!shipping || shipping.length === 0) {
    return null;
  }
  return (
    <div className="bg-[#C68B73] text-white text-[11px] xl:text-sm px-4 md:px-6 py-2 sm:py-3 flex justify-center sm:justify-between items-center">
      {loading ? (
        <Skeleton width={200} height={16} />
      ) : (
        <span>{shipping?.content}</span>
      )}

      <div className="hidden md:block">
        <CurrencyToggle currencyList={currencyList} />
      </div>
    </div>
  );
};

export default TopBar;
