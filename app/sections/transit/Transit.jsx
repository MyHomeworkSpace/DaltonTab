import "sections/transit/Transit.styl"

import { h, Component } from 'preact'

import ajax from "ajax.js"

import Loading from "ui/Loading.jsx"
import TransitList from 'sections/transit/TransitList.jsx'

export default class Transit extends Component {
    constructor() {
        this.state = {
            loading: true
        }
        this.load()
    }

    colors() {
        return {
            subway: {
                "ACE": "#0039A6",
                "BDFM": "#FF6319",
                "G": "#6CBE45",
                "JZ": "#996633",
                "L": "#A7A9AC",
                "NQR": "#FCCC0A",
                "S": "#808183",
                "123": "#EE352E",
                "456": "#00933C",
                "7": "#B933AD",
                "SIR": "#333399"
            },
            lirr: {
                "Babylon": "#00985F",
                "Belmont": "#60269E",
                "City Terminal Zone": "#4D5357",
                "Far Rockaway": "#6E3219",
                "Hempstead": "#CE8E00",
                "Long Beach": "#FF6319",
                "Montauk": "#006983",
                "Oyster Bay": "#00AF3F",
                "Port Jefferson": "#0039A6",
                "Port Washington": "#C60C30",
                "Ronkonkoma": "#A626AA",
                "West Hempstead": "#00A1DE"
            },
            metroNorth: {
                "Harlem": "#0039A6",
                "Hudson": "#009B3A",
                "New Haven": "#EE0034",
                "Pascack Valley": "#8E258D",
                "Port Jervis": "#FF7900"
            },
            bridgeTunnel: {},
            bus: {}
        }
    }

    load() {
        let that = this;
        // ajax.request("GET", "https://daltontabservices.myhomework.space/v1/getMTAStatus.php")
        ajax.request("GET", "https://daltontabservices.myhomework.space/v1/getMTAInfo.php", {}, data => {
            that.setState({
                loading: false,
                data: {
                    bridgeTunnel: data.BT.line,
                    lirr: data.LIRR.line,
                    metroNorth: data.MetroNorth.line,
                    bus: data.bus.line,
                    subway: data.subway.line
                }
            })
        })
    }

    render(props, state) {
        let colors = this.colors()
        if (state.loading) {
            return <Loading section="transit" />
        }
        return <div class="transit-section">
            <div class="mta-service">
                <h3>Subway</h3>
                <TransitList data={state.data.subway} colors={colors.subway} />
            </div>
            <div class="mta-service">
                <h3>Bus</h3>
                <TransitList data={state.data.bus} colors={colors.bus} />
            </div>
            <div class="mta-service">
                <h3>Bridges/Tunnels</h3>
                <TransitList data={state.data.bridgeTunnel} colors={colors.bridgeTunnel} />
            </div>
            <div class="mta-service">
                <h3>LIRR</h3>
                <TransitList data={state.data.lirr} colors={colors.lirr} />
            </div>
            <div class="mta-service">
                <h3>MetroNorth</h3>
                <TransitList data={state.data.metroNorth} colors={colors.metroNorth} />
            </div>
        </div>
    }
}