"use client"

import { Agency, Contact, Plan, User } from "@prisma/client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface ModalProviderProps {
  children: ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
  contact?: Contact;
  plans?: {
    defaultPriceId: Plan;
  };
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (modal: ReactNode, fetchData?: () => Promise<any>) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose=()=>{
    setIsOpen(false)
    setData({})
  }

  if (!isMounted) {
    return null;
  }

  return (
    <ModalContext.Provider value={{data,isOpen,setOpen,setClose}}>
        {children}
        {showingModal}
    </ModalContext.Provider>
  )
};

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
      throw new Error('useModal must be used within the modal provider')
    }
    return context
  }
  
  export default ModalProvider