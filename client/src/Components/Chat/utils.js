import { IoCheckmark } from "react-icons/io5";
import { LuCheckCheck } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";

export function formatTimestamp(timestamp) {
    if (!timestamp)
        return ""
    const now = new Date();
    const givenDate = new Date(timestamp);
  
    if (
      now.getFullYear() === givenDate.getFullYear() &&
      now.getMonth() === givenDate.getMonth() &&
      now.getDate() === givenDate.getDate()
    ) {
      // It's today, show time:
      return givenDate.toLocaleTimeString([], { timeStyle: 'short' });
    } else {
      // It's not today, show the date:
      return givenDate.toLocaleDateString(); // Or customize this
    }
}

export const getTick = (status) => {
    switch (status){
      case 'delivered':
        return <LuCheckCheck className='font-bold text-lg' />;
      case 'sent': 
        return <IoCheckmark className='font-bold text-lg' />;
      case 'seen':
        return <LuCheckCheck className='font-bold text-lg text-blue-500' />;
      default:
        return <FaRegClock className='font-bold text-lg' />;
    };
}
