import '../stylesheet/footer.css';
import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import '../stylesheet/footer.css';
export const Footer = () => {
  return (
      <div className="yoyos">
    <MDBFooter color="blue" className="font-small pt-4 mt-4 container">
      <MDBContainer fluid className="text-right text-md-right">
        <MDBRow>
          <MDBCol md="5">
            <h5 className="title">About</h5>
            <ul>
              <li className="list-unstyled">
                Idea By: <a href="#">Gp Capt M M Anil Kumar</a>
              </li>
            </ul>            
          </MDBCol>          
          <MDBCol md="4">
            <h5 className="title">Contact Us</h5>
            <ul>
              <li className="list-unstyled">
                <a href="#!">+913532698206</a>
              </li>
              <li className="list-unstyled">
                <a href="#!">urc20wingairforce@gmail.com</a>
              </li>
              </ul>
          </MDBCol>
          <MDBCol md="3">
            <h5 className="title">Address</h5>
            <ul>
              <li className="list-unstyled">
                <a href="#!">Unit Run Canteen<br></br>
                Air Force Station Bagdogra</a>
              </li>
              
              </ul>
          </MDBCol>
          
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="https://www.urcbagdogra.in">  URCBagdogra</a>
        </MDBContainer>
      </div>
    </MDBFooter>
    </div>
  );
};

