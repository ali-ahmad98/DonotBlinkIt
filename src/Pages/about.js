import React from 'react'
import '../App.css';
import { MDBCol, MDBContainer, MDBRow } from "mdbreact"
import {Navbar} from '../components/navbar';
import FullScreenMode from '../components/FullScreen';

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openNav: false,
            desktop: false
        }
    }
    SideBar = () => {
        this.setState({ openNav: !this.state.openNav })
    }
    componentDidMount() {
        window.addEventListener('resize', this.UpdateDesktop)
    }
    componentWillMount() {
        window.addEventListener('resize', this.UpdateDesktop)
    }
    UpdateDesktop = () => {
        this.setState({ desktop: !this.state.desktop })
    }
    render() {

        return <div>
           {/* navbar */}
           <Navbar quit={false} />

            <MDBContainer style={{ height: window.innerHeight - 200, marginTop: '20%' }}>
                <MDBRow>
                    <MDBCol size={2} md={4} lg={4}>
                        <h1>About</h1>
                    </MDBCol>
                    <MDBCol sm={12} md={8} lg={8} >
                        <h5> text <br />
                        next line <br />
                            
                        </h5>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
           <FullScreenMode />
        </div>
    }
}