import React, { createContext, useState, useEffect } from 'react';
import { getListings, addListing, updateListing, deleteListing } from './api/api';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const response = await getListings();
    setListings(response.data);
  };

  const addNewListing = async (listing) => {
    const response = await addListing(listing);
    setListings((prevListings) => [...prevListings, response.data]);
  };

  const updateExistingListing = async (id, updatedData) => {
    await updateListing(id, updatedData);
    loadListings();
  };

  const deleteExistingListing = async (id) => {
    await deleteListing(id);
    loadListings();
  };

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        addNewListing,
        updateExistingListing,
        deleteExistingListing,
        loadListings,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContext;
