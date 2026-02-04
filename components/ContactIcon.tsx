import React from 'react'

interface ContactIconProps {
  name: string;
}

const ContactIcon = ({ name }: ContactIconProps) => {
    const initial = name.charAt(0).toUpperCase();
  
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
        {initial}
      </div>
    );
  };
  
  export default ContactIcon;