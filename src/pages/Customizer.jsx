import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'

import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'

import { AIPicker, FilePicker, ColorPicker, Tab, CustomButton } from '../components'

const Customizer = () => {
    const snap = useSnapshot(state);

    const [file, setFile] = useState(''); //for image picker

    const [promt, setPromt] = useState('');
    const [generatingImg, setGeneratingImg] = useState(false);

    const [activeEditorTab, setActiveEditorTab] = useState(''); //for tabs
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false
    });

    //show tab content depending on active tab
    const generateTabContent = () => {
        switch (activeEditorTab) {
            case 'colorpicker':
                return <ColorPicker />
            case 'filepicker':
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case 'aipicker':
                return <AIPicker 
                    promt={promt}
                    setPromt={setPromt}
                    generateImg={generateImg}
                    handleSubmit={handleSubmit}
                />
            default: return null;
        }
    }

    const handleSubmit = async (type) => {
        if(!promt) return alert ('Please enter a promt');

        try {
            //call backend to gen ai img
        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab('');
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result; //update decal state in store

        //checks the filter selected on bottom tab
        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab);
        }
    }
    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case 'logoShirt':
                state.isLogoTexture = !activeFilterTab[tabName]; //toogle it
                break;
            case 'stylishShirt':
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
        }

        //set active filter tabs update ui

        setActiveFilterTab((prevState) => {
            return {
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        })
    }
    const readFile = (type) => {
        reader(file)
            .then((result) => {
                handleDecals(type, result)
                setActiveEditorTab(''); //reset tabs
                setFile('');
            })
    }

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation('left')}
                    >
                        <div className='flex items-center min-h-screen'>
                            <div className='editortabs-container tabs'>
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => { setActiveEditorTab(tab.name) }}
                                    />
                                ))}
                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
                        <CustomButton
                            type='filled'
                            title='Go Back'
                            handleClick={() => state.intro = true}
                            customStyles={`w-fit px-4 py-2.5 font-bold text-sm`}
                        />
                    </motion.div>
                    <motion.div className='filtertabs-container' {...slideAnimation('up')}>
                        {FilterTabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer