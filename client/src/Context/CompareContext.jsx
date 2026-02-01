import React, { createContext, useState, useContext } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState([]);

  const addToCompare = (product) => {
    setCompareProducts(prev => {
      if (prev.some(p => p.productVariantSlug === product.productVariantSlug)) return prev;
      if (prev.length >= 3) return prev; 
      return [...prev, product];
    });
  };

  const removeFromCompare = (productVariantSlug) => {
    setCompareProducts(prev => prev.filter(p => p.productVariantSlug !== productVariantSlug));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  return (
    <CompareContext.Provider 
      value={{ compareProducts, addToCompare, removeFromCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);