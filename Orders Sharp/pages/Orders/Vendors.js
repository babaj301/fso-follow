import React from 'react'
import GoBack from '../../components/GoBack';
import Header from '../../components/Header';
import VendorsTable from '../../tables/Orders/vendorsTable';


const VendorsPage = () => {
    return ( 
        <>
            <GoBack />
            <div className='mt-4'>
                <Header text="Vendor" />
            </div>
            <VendorsTable />
        </>
     );
}
 
export default VendorsPage;