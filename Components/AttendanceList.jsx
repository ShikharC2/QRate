import { useState } from "react";
import { Table } from 'antd';
function AttendanceList({data}){

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

];
    return(
        <div>
            <Table dataSource={data} columns={columns} />
        </div>
    )
}
export default AttendanceList;