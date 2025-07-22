import React from 'react'
import GoBack from '../../components/GoBack';
import Header from '../../components/Header';
import VendorPaymentTable from '../../tables/Orders/vendorPaymentTable';

const VendorPaymentsPage = () => {
    return ( 
        <>
            <GoBack />
            <div className='mt-4'>
                 <Header text="Vendor Payments" />
            </div>
            <VendorPaymentTable />
       
        </>
     );
}
 
export default VendorPaymentsPage;