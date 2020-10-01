
import React from "react";
import "../stylesheet/maintenance.css";

const MaintenanceMessage= ()=>{
    return(
        <div className="main-body"> 
            <article>       
                <h1>We&rsquo;ll be back soon!</h1>
                <div>
                    <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always <a href="mailto:#">contact us</a>, otherwise we&rsquo;ll be back online shortly!</p>
                    <p>&mdash; URC Bagdogra Team</p>
                </div>
            </article>
        </div>
    )
}

export default MaintenanceMessage;