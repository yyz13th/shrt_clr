import { proxy} from "valtio";

const state = proxy({
    intro: true,
    color: '#EFBD48',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './ebomb.png',
    fullDecal: './ebomb.png',
})

export default state