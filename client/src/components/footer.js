import React from 'react';
import '../stylesheet/footer.css';

export const Footer = () => {
    return(
        <div className="footer">
            <div className="container">
                <div className="row justify-content-center">             
                    <div className="col-auto">                        
                        <div className="copyright">
                            <p>© {new Date().getFullYear()} URC Bagdogra</p>
                        </div>                        
                    </div>
                </div>
            </div>            
        </div>
    );
};