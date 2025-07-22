import React from 'react'
import Header from '../../components/Header';
import OverdueOrdersTable from '../../tables/Orders/overdueTable';

const OverdueOrdersPage = () => {
    return (
        <>
            <Header text="Overdue Orders" />
            <OverdueOrdersTable />
        </>
      );
}
 
export default OverdueOrdersPage;