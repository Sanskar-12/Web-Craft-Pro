"use client"

import { useModal } from "@/providers/modal-provider"
import { Button } from "../ui/button"
import CustomModal from "../custommodal/custom-modal"
import UploadMediaForm from "../forms/upload-media"

interface UploadButtonProps {
    subaccountId:string
}


const UploadButton = ({subaccountId}:UploadButtonProps) => {
    const {isOpen,setOpen,setClose}=useModal()

  return (
    <Button onClick={()=>{
        setOpen(
            <CustomModal title="Upload Media" subheading="Upload a file to your media bucket">
                {/* Upload media form */}
                <UploadMediaForm subaccountId={subaccountId}/>
            </CustomModal>
        )
    }}>
        Upload
    </Button>
  )
}

export default UploadButton