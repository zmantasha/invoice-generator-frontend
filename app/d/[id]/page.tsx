"use client";
import { useParams, useRouter } from "next/navigation";
import styles from "./view.module.css";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/UserContext";
import { Button } from "../../../components/ui/button";
import { BadgeInfo, BookMarked, Calendar, ChevronDown, Delete, Dot, Edit, User } from "lucide-react";
import InvoiceGenerator from "../../../components/invoicee/invoiceGenerator";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/ui/input";
import { MdEmail } from "react-icons/md";
import PDFGenerator from "../../../components/invoicee/PDFGenerator";
export default function ViewPage() {
  const { user } = useUser();
  const [invoiceItem, setInvoiceItem] = useState<any>(null); // Use 'any' if the invoiceItem structure is not defined yet
  const { id } = useParams();
  const router=useRouter()
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement | null>(null); 
  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8002/api/v1/invoice/invoices/${id}`
      );
      const data = response.data;
      setInvoiceItem(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {

      const generatedUrl = `http://localhost:3000/d/${id}`; // Replace with the actual field in your invoice data
      setShareUrl(generatedUrl);
      setModalOpen(true);
  }; 
  console.log(invoiceItem)


  const handleShare = (platform: string) => {
    const message = `Check out this invoice: ${shareUrl}`;
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    } else if (platform === "email") {
      window.location.href = `mailto:?subject=Invoice Share&body=${encodeURIComponent(message)}`;
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    }
  };
  
  

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const toggleDropdown = () => {
    console.log("dropdoen")
    setShowDropdown((prev) => (prev ? null : "dropdown"));
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(null); // Close dropdown if clicked outside
    }
  };

  // Attach event listener when dropdown is open
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  if (!invoiceItem) {
    return <div>Loading...</div>; // Display a loading message while data is being fetched
  }

  const handleEditInvoice=()=>{
    
     router.push(`/user/editInvoice/${id}`)
  }

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Paid" ? "pending" : "Paid";

    try {
        const response = await fetch(`http://localhost:8002/api/v1/invoice/invoices/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setInvoiceItem((prevInvoice: any) => {
            if (!prevInvoice) return null;
            return {
              ...prevInvoice,
              status: newStatus,
            };
          });
        } else {
            console.error("Failed to update invoice status.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
};


  return (
    <>
      <div className={styles.viewPage}>
        <div className={styles.viewContainer}>
          <div className={styles.viewCard}>
            {/* View Invoice Header */}
            {user?.user._id && (
              <div className={styles.viewHeader}>
                {invoiceItem.invoiceDetails && (
                  <div className={styles.headerTop}>
                    <h1>{invoiceItem.invoiceDetails.number}</h1>
                    <p>
                      <span>
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(
                          invoiceItem.invoiceDetails.date
                        ).toLocaleDateString()}
                      </span>
                      {invoiceItem.status==="Paid" && <span className="text-blue-700 font-bold">
                    <Dot className="w-6 h-4 mr-1 font-bold text-blue-700" />
                        {invoiceItem.status}
                      </span>
                       }
                      <span>
                        <User className="w-4 h-4 mr-1" />
                        {invoiceItem.recipientDetails.billTo.name}
                      </span>
                    </p>
                  </div>
                )}
                <div className={styles.headerButtons}>
                <span className={styles.moreOptionDropdown}>
                <Button onClick={handleOpenModal} className="bg-green-800 hover:bg-green-700">
                    Share
                  </Button>
                   <PDFGenerator
                    invoiceElementId="invoice"
                    fileName={invoiceItem?.invoiceDetails?.number || "invoice"}
                  />
                  
                  <Button variant="outline" className="text-gray-600 " onClick={toggleDropdown}>
                    More Options <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                 
                  {showDropdown &&  (
                      <div ref={dropdownRef} className={styles.dropdownMenu}> 
                        <div className={styles.dropdownContent} onClick={handleEditInvoice}>
                          <Edit className="w-4 h-4 mr-2"  />
                          edit</div>
                        <div className={styles.dropdownContent} onClick={() => handleStatusChange(invoiceItem._id, invoiceItem.status)}>
                        <BadgeInfo className="w-4 h-4 mr-2 text-green-700"    />
                        {invoiceItem.status==="Paid" ?"Mark as not Paid":"Mark as Paid"}</div>
                        <div
                          className={styles.dropdownContent}
                        >
                          <Delete className="w-4 h-4 mr-2 text-red-500" />
                          Delete
                        </div>
                      </div>)}
                </span>
              </div>
              </div>
            )}
            {/* View Invoice/ Main Section */}
            <hr />
            <div id="invoice">
              <InvoiceGenerator invoiceItem={invoiceItem} />
            </div>
          </div>
        </div>
      </div>

        {/* Share Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <h3 className="text-2xl text-green-900 font-bold mb-4">Share Invoice</h3>
          <div>
            <label className="text-xl font-semibold">Invoice URL: </label>
            <Input type="text" value={shareUrl} readOnly  className="border-black hover:border-input focus:border-input mt-2" />
          </div>
          <div className="flex mt-6 mb-6 gap-1">
          <FaWhatsapp 
          onClick={() => handleShare("whatsapp")} 
          className="text-green-500 text-4xl" // You can change this to any color you prefer
        />
        <MdEmail 
          onClick={() => handleShare("email")} 
          className="text-red-500 text-4xl" // Adjust the color and font size here
        />
        <FaTwitter 
          onClick={() => handleShare("twitter")} 
          className="text-blue-500 text-4xl" // Adjust the color and font size here
        />
        <FaFacebook 
          onClick={() => handleShare("facebook")} 
          className="text-blue-500 text-4xl" // Adjust the color and font size here
        />
        <FaInstagram
          onClick={() => handleShare("instagram")} 
          className="text-pink-500 text-4xl" // Adjust the color and font size here
        />
          </div>
        </div>
      </Modal>
    </>
  );
}
