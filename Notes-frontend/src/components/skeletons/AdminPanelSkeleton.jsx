import React from 'react'

const AdminPanelSkeleton = () => {
  return (

           <>
      <tr className="border-b border-gray-200">
        <td className="py-3 px-6 text-left whitespace-nowrap">
          <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
        </td>
      </tr>
      <tr className="border-b border-gray-200">
        <td className="py-3 px-6 text-left whitespace-nowrap">
          <div className="animate-pulse bg-gray-300 h-4 w-36 rounded"></div>
        </td>
      </tr>
    
    </>
  )
}

export default AdminPanelSkeleton