import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FaRegCalendarAlt, FaRegClock, FaCalculator } from 'react-icons/fa';
import Map from '../Map'

const yaoundeLocation = { lat: 3.8480, lng: 11.5021 };
const Section1 = () => {
  return (
    <section className='w-full h-[70vh] p-0 justify-center items-center flex flex-col mb-4 mt-0'>
         {/* <div className='w-full h-full relative'>
            <img src="/theme_sombre.png" alt="Logo sombre"
                className="hidden dark:block w-full h-96 mt-50 " />
        </div> */}

        <div className="hidden dark:block relative w-full h-full mt-0">
            {/* Image de fond */}
            <div
                className="absolute inset-0 bg-cover bg-center w-full h-screen"
                style={{ backgroundImage: "url('/calcul.jpg')" }}
            />

            {/* Voile noir fondu au-dessus de l'image */}
            {/* <div className="absolute inset-0 bg-black/50 h-screen" /> */}

            {/* Contenu au-dessus de l'image + fondu */}
            {/* <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl font-bold">Mon composant</h1>
                <p>Le contenu ici s'affiche au-dessus de l'image + fondu.</p>
            </div> */}
            <div className='flex justify-center items-center z-10 h-screen'>
            <div className='w-full p-4 rounded relative h-screen mt-52'>
                <div className='w-auto h-96 rounded-3xl justify-center items-center flex flex-col gap-4'>
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
                        <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegClock /></span>Maintenant</Button>
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
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaCalculator /></span>Cout calcule</Button>
                </div>
            </div>
            <div className="relative w-full h-[400px] mr-5 mt-0 rounded-2xl">
                 {/* <img
                    src="/planifier.jpg"
                    alt="Fond"
                    className="w-full h-full object-cover"
                /> */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
                 <Map 
                    center={yaoundeLocation}
                    zoom={12}
                />
            </div>

            </div>

            
        </div>

        <div className="relative w-full h-full mt-0 dark:hidden">
            {/* Image de fond */}
            <div
                className="absolute inset-0 bg-cover bg-center w-full h-screen"
                style={{ backgroundImage: "url('/theme.png')" }}
            />

            {/* Voile noir fondu au-dessus de l'image */}
            <div className="absolute inset-0 bg-black/50 h-screen" />

            {/* Contenu au-dessus de l'image + fondu */}
            {/* <div className="relative z-10 p-4 text-white">
                <h1 className="text-4xl font-bold">Mon composant</h1>
                <p>Le contenu ici s'affiche au-dessus de l'image + fondu.</p>
            </div> */}
            <div className='flex justify-center items-center z-10 h-screen'>
            <div className='w-full p-4 rounded relative h-screen mt-52'>
                <div className='w-auto h-96 rounded-3xl justify-center items-center flex flex-col gap-4 dark:bg-orange-700'>
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
                        <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegCalendarAlt /></span>Aujourd'hui</Button>
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaRegClock /></span>Maintenant</Button>
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
                    <Button className='text-black bg-white w-54 h-12 cursor-pointer hover:bg-blue-500 shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    hover:scale-105 hover:shadow-2xl'><span><FaCalculator /></span>Cout calcule</Button>
                </div>
            </div>
            <div className="relative w-full h-[400px] mr-5 rounded-2xl">
                 {/* <img
                    src="/planifier.jpg"
                    alt="Fond"
                    className="w-full h-full object-cover"
                /> */}
                {/* <div className="absolute inset-0 bg-black/50" /> */}
                 <Map 
                    center={yaoundeLocation}
                    zoom={12}
                />
            </div>

            </div>

            
        </div>

        {/* <div className="relative w-full h-full mt-0 flex justify-center items-center dark:hidden bg-cover bg-center" style={{ backgroundImage: "url('/theme.png')" }}>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50" />
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
        <div className="relative w-full h-[400px]">
            <img
                src="/planifier.jpg"
                alt="Fond"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        </div> */}
        {/* <div className="relative w-full h-full mt-80 dark:hidden">
            <img
                //src="/order-taxi.png"
                //src="/image_fondu.png"
                src="/theme.png"
                alt="Fond"
                className="w-full h-96 mt-10 object-cover"
            />
            <div className="absolute top-10 right-0 bottom-0 left-0 bg-black/50" />
        </div> */}
        {/* <div className='justify-center items-center flex dark:mt-50'>
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
        <div className="relative w-full h-[400px]">
            <img
                src="/planifier.jpg"
                alt="Fond"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        </div> */}
        
    </section>
  )
}

export default Section1
