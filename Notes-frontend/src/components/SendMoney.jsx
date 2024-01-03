import React, { useEffect, useState } from 'react';
import { getUsersLeaderBoard } from '../redux/user/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { transferCoins } from '../redux/coins/coinsActions';


const SendMoneyCard = () => {
  const dispatch = useDispatch();
  const [recieverId, setRecieverId] = useState('');
  const [coins, setAmount] = useState(0);

  const leaderBoard = useSelector((state) => state.userDetails.leaderBoard);
  const handleSend = () => {
    console.log(`Sending ${coins} to ${recieverId}`);
    console.log(typeof (coins))
    dispatch(transferCoins({ recieverId, coins }));
  }


  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="text-center p-4">
        <h2 className="text-2xl font-bold">Send Money</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label htmlFor="recieverId" className="block text-gray-700 text-sm font-bold mb-2">Recipient Name</label>
          <select
            type="text"
            id="recieverId"
            name='recieverId'
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Recipient Name"
            value={recieverId}
            onChange={(e) => setRecieverId(e.target.value)}
          >
            <option>Select User</option>
            {

              leaderBoard?.map((user, index) => {

                return (

                  <option key={user.id} value={user.id}>{user.username}</option>
                )
              })
            }
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Amount"
            name='coins'
            value={coins}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendMoneyCard;
