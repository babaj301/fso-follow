import React from 'react'
import GoBack from '../../components/GoBack';
import Header from '../../components/Header';
import RefundsTable from '../../tables/Orders/refundsTable';


const RefundOrdersPage = () => {
    return ( 
        <>
            <GoBack />
            <div className='mt-4'>
                 <Header text="Refunds" />
            </div>
            <RefundsTable />
        </>
     );
}
 
export default RefundOrdersPage;