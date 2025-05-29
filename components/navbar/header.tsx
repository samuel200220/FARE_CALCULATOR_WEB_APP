"use client"

import React from 'react'

import { FaGlobe } from 'react-icons/fa';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { Button } from '../ui/button'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from '../ui/mode-toggle';



const Header = () => {
    const [isMenuOpen,setIsMenuOpen]=React.useState(false)
    return (
        <header className='sticky top-0 z-[100] h-20 flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-500 to-blue-500 w-full dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-900'>
            <div className='flex items=center lg:hidden'>
            <Sheet
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
            >
                <SheetTrigger asChild>
                    <Button
                    variant={'ghost'}
                    size={'icon'}>
                        <Menu className='h-6 w-6'/>
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-full' side={'top'}>
                    <nav className='flex flex-col space-y-4'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'} className='w-full justify-start'>
                                Find designers
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link className='w-full' href={"#"}>
                                    Designer Search
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link className='w-full' href={"#"}>
                                    Post a job
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href={"#"} className='text-sm font-medium text-muted-foreground hover: w-full'>
                            Nos services
                        </Link>
                        <Link href={"#"} className='text-sm font-medium text-muted-foreground hover: w-full'>
                            App mobile
                        </Link>
                        <Link href={"#"} className='text-sm font-medium text-muted-foreground hover: w-full'>
                            A propos
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            </div>

            <nav className='hidden lg:flex items-center gap-6 '>
            {/* <Link href={"/"} className='text-2xl font-bold hoover:text-foreground/65 text-white flex items-center'>
                Fare Calculator
            </Link> */}
            {/* <h2 className='font-bold text-white items-center text-2xl'>Fare Calculator</h2> */}
            <Link href={'#'} scroll={true} className='font-bold text-white items-center text-3xl'>Fare Calculator</Link>
            </nav>
            {/* <div className='flex items-center space-x-4'>
                <Button variant={'ghost'} size={'icon'} className='lg:hidden'>
                    <Search className='h-6 w-5'/>
                    <span className='sr-only'>Open search</span>
                </Button>
                <div className='hidden lg:block relative'>
                    <Search className='h-4 w-4 absolute top-1/3 left-3 transform -translate-y-1/2 text-muted-foreground'/>
                    <Input 
                    className='pl-10 pr-4 py-5 rounded-full'
                    placeholder='Search'
                    type="search"
                    />
                </div>
            </div> */}
            <div className='flex items-center gap-4 dark:flex dark:items-center dark:gap-4'>
            <Link href={"/dashboard"} className='text-white  font-medium text-[18px] hover:text-violet-800 dark:text-white dark:hover:text-violet-600'>
                        Tableau de bord
                </Link>
                <Link href={"#propos"} className='text-white text-sm font-medium text-[18px] hover:text-violet-800 dark:text-white dark:hover:text-violet-600'>
                    Aide
                </Link>
            <Button className='mr-6 bg-transparent border-none shadow-none text-white text-[18px] cursor-pointer hover:bg-blue-300'><span className='text-xl text-white dark:text-violet-400'><FaGlobe /></span>English</Button>
            <ModeToggle />
                <Link href={"/inscription"} >
                <Button className='cursor-pointer bg-blue-300 hover:bg-blue-300 text-[18px] text-white'>S'inscrire</Button>
                </Link>
                <Link href={"/connexion"} >
                <Button className='cursor-pointer bg-blue-300 hover:bg-blue-300 text-[18px] text-white'>Se connecter</Button>
                </Link>
            </div>
        </header>
  )
}

export default Header