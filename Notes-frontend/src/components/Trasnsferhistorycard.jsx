import React from 'react'

const Trasnsferhistorycard = () => {
    return (
        <div className='overflow-x-auto overflow-y-auto max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl'>
            <table className="table-auto w-full text-center mb-5">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-white ">
                    <tr>
                        <th className="p-2 whitespace-nowrap ">
                            <div className="font-semibold  ">Date</div>
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
                            <div className="font-semibold ">Amount</div>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                    <tr>
                        <td>hiahgadfgdfhasjsrkeyksr</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                    </tr>
                    <tr>
                        <td>hiahg</td>
                        <td>hiahgadfgdfhasjsrkeyksr</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                    </tr>
                    <tr>
                        <td>hiahg</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                        <td>hiahadfgdfhasjsrkeyksrg</td>
                    </tr>
                    <tr>
                        <td>hiahg</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                    </tr>
                    <tr>
                        <td>hiahg</td>
                        <td>hiaadfgdfhasjsrkeyksrhg</td>
                        <td>hiahg</td>
                        <td>hiahg</td>
                    </tr>

                </tbody>
            </table>
            <h2 className="text-xl font-semibold text-center">Current Coins :</h2>
        </div>
    )
}

export default Trasnsferhistorycard