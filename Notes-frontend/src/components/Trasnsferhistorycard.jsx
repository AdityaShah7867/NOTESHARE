import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const host = process.env.REACT_APP_API_HOST;

const Trasnsferhistorycard = () => {

    const [history, setHistory] = useState([]);
    const user = useSelector((state) => state.user.user)


    const fetchTransferHistroyData = async () => {
        try {
            const response = await axios.get(`${host}/api/v1/transfer/getTransferCoinsByUser`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                },
            })

            if (response.status === 200) {
                setHistory(response.data.transferCoinsHistory)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useState(() => {
        fetchTransferHistroyData()
    }
        , [])

    return (
        <div className='overflow-x-auto overflow-y-auto max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
            <table className="table-auto w-full text-center mb-5">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-white ">
                    <tr>
                        <th className="p-2 whitespace-nowrap ">
                            <div className="font-semibold  ">Date</div>
                        </th>
                        <th className="p-2 whitespace-nowrap ">
                            <div className="font-semibold  ">Time</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold ">Sender</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                            {/* red color name for sent and green for recieved */}
                            <div className="font-semibold ">Reciever</div>
                        </th>

                        <th className="p-2 whitespace-nowrap">
                            {/* red color amount for sent and green for recieved */}
                            <div className="font-semibold ">Coins</div>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    {history?.map((item) => (
                        <tr key={item._id}>
                            <td className="p-2 whitespace-nowrap">
                                <div className="font-semibold">{new Date(item.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className="font-semibold">{new Date(item.createdAt).toLocaleTimeString()}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className="font-semibold">{item.sender.username}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className="font-semibold">{item.receiver.username}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className={`font-semibold ${item.received === `No` ? `text-red-500` : `text-green-500`}`}>{item.coins} </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 className="text-xl font-semibold text-center">Current Coins :{user.coins}</h2>
        </div>
    )
}

export default Trasnsferhistorycard