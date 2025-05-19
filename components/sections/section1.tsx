import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

const Section1 = () => {
  return (
    <section className='w-full h-[70vh] p-4 justify-center items-center flex flex-col mb-4 mt-0 dark:mt-25'>
        <div className='w-full h-full relative'>
            <img src="/taxi_nuit.jpg" alt="Logo sombre"
                className="hidden dark:block w-full h-96 mt-50" />
        </div>
        <div className='justify-center items-center flex dark:mt-50'>
        <div className='w-full h-full p-4 rounded'>
            <div className='w-auto h-96 bg-blue-600 rounded-3xl justify-center items-center flex flex-col gap-4 dark:bg-orange-700'>
                <h4 className='text-center text-white'>CALCULEZ LES TARIFS POUR N'IMPORTE QUELLE DESTINATION AVEC FARE CALCULATOR</h4>
                <Input 
                    className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                    placeholder='Lieu de depart'
                />
                <Input 
                    className='bg-white w-110 h-12 px-4 py-2 rounded border border-gray-300 shadow'
                    placeholder='Lieu de depot'
                />
                <div className='justify-center items-center flex gap-6'>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-green-500'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-green-500'><span><FaRegClock /></span>Maintenant</Button>
                </div>
                <div className='justify-center items-center flex gap-6'>
                    <RadioGroup defaultValue="Ramassage" className='justify-center items-center flex gap-20'>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="r1" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                            <Label htmlFor="r1" className='text-white'>Ramassage</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Depot" id="r2" className="border-2 border-gray-400 rounded-full w-4 h-4 data-[state=checked]:bg-black data-[state=checked]:border-black"/>
                            <Label htmlFor="r2" className='text-white'>Depot</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-green-500'>Cout calcule</Button>
            </div>
        </div>
        <div className='w-full h-full relative'>
            <img src="/carte.jpg" className='w-full h-full object-cover' />
        </div>
        </div>
        
    </section>
  )
}

export default Section1
