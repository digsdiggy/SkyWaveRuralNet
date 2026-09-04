import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    addDoc,
    collection,
    getDocs,
    getDoc,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* FIREBASE CONFIG */

  const firebaseConfig = {
  apiKey: "AIzaSyCnAnOHXnoOfyMTB78L9si9JK5LPjQSi8M",
  authDomain: "skywaveruralnet-bc0d9.firebaseapp.com",
  projectId: "skywaveruralnet-bc0d9",
  storageBucket: "skywaveruralnet-bc0d9.firebasestorage.app",
  messagingSenderId: "27492824931",
  appId: "1:27492824931:web:9930f4320ead4f2dbfc556"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
   SIMPLE ADMIN ROLE CHECK
   (Upgrade later with Firestore roles)
========================= */
const ADMIN_EMAILS = [
    "admin@skywaveruralnet.org"
];

/* =========================
   AUTH STATE LISTENER
========================= */


/* =========================
   VOLUNTEER FORM
========================= */
window.submitVolunteer = async function(event){

    event.preventDefault();

    const name = document.getElementById("v_name").value;
    const email = document.getElementById("v_email").value;
    const phone = document.getElementById("v_phone").value;

    const address1 = document.getElementById("v_address1").value;
    const address2 = document.getElementById("v_address2").value;
    const town = document.getElementById("v_town").value;
    const county = document.getElementById("v_county").value;
    const postcode = document.getElementById("v_postcode").value;

    const interest = document.getElementById("v_interest").value;
    const skills = document.getElementById("v_skills").value;
    const availability = document.getElementById("v_availability").value;
    const role = document.getElementById("v_role").value;


    try {

        await addDoc(collection(db,"volunteers"),{

            name:name,
            email:email,
            phone:phone,

            address1:address1,
            address2:address2,
            town:town,
            county:county,
            postcode:postcode,

            interest:interest,
            skills:skills,
            availability:availability,
            motivation:role,

            createdAt:new Date(),
            status:"Pending"

        });


        alert("Volunteer application submitted successfully");

        event.target.reset();


    } catch(error){

        console.error(error);
        alert(error.message);

    }

};
/* =========================
   CONTACT FORM
========================= */
window.sendMessage = async function(event){

event.preventDefault();


try{


await addDoc(collection(db,"messages"),{


name: c_name.value,

email: c_email.value,

phone: c_phone.value,


address:{
    line1: c_address1.value,
    line2: c_address2.value,
    town: c_town.value,
    county: c_county.value,
    postcode: c_postcode.value
},


subject: c_subject.value,


message: c_message.value,


createdAt: new Date()


});



alert("Your message has been sent successfully.");


// clear form

c_name.value="";
c_email.value="";
c_phone.value="";

c_address1.value="";
c_address2.value="";
c_town.value="";
c_county.value="";
c_postcode.value="";

c_subject.value="General Enquiry";

c_message.value="";


}


catch(error){

alert(
"Error sending message: " + error.message
);

}


}
/////////////////////////////////////////////////////
window.loadMessages = async function(){


const box=document.getElementById("adminData");


box.innerHTML="Loading messages...";


try{


const snapshot = await getDocs(
collection(db,"messages")
);



let html = `
<h2>Contact Enquiries</h2>
`;



if(snapshot.empty){

html += `
<p>No messages received.</p>
`;

}



snapshot.forEach((doc)=>{


const m = doc.data();



html += `

<div class="card">


<h3>
${m.name}
</h3>


<p>
<strong>Email:</strong>
${m.email}
</p>


<p>
<strong>Phone:</strong>
${m.phone || "Not provided"}
</p>



<h4>Address</h4>

<p>

${m.address?.line1 || ""}<br>

${m.address?.line2 || ""}<br>

${m.address?.town || ""}<br>

${m.address?.county || ""}<br>

${m.address?.postcode || ""}

</p>



<p>
<strong>Subject:</strong>
${m.subject}
</p>


<h4>Message</h4>

<p>
${m.message}
</p>


<small>
Submitted:
${m.createdAt?.toDate
? m.createdAt.toDate().toLocaleString()
: ""}
</small>
<button
    class="delete-btn"
    onclick="deleteRecord('messages', '${doc.id}')"
>
    Delete Message
</button>



</div>

`;



});



box.innerHTML=html;


}


catch(error){


box.innerHTML =
`
<p>
Error loading messages:
${error.message}
</p>
`;

}



}
////////////////////////////////////////////////////////////////

window.loadPartners = async function(){


const box=document.getElementById("adminData");


box.innerHTML="Loading partners...";


const snapshot =
await getDocs(collection(db,"partners"));



let html="<h2>Partner Applications</h2>";



snapshot.forEach((doc)=>{


const p=doc.data();



html += `

<div class="card">


<h3>
${p.organisation}
</h3>


<p>
<strong>Contact:</strong>
${p.contactPerson}
</p>


<p>
<strong>Email:</strong>
${p.email}
</p>


<p>
<strong>Phone:</strong>
${p.phone || "Not provided"}
</p>


<h4>Address</h4>

<p>

${p.address.line1}<br>

${p.address.line2 || ""}<br>

${p.address.town}<br>

${p.address.county}<br>

${p.address.postcode}

</p>



<p>
<strong>Organisation Type:</strong>
${p.organisationType}
</p>


<p>
<strong>Partnership Interest:</strong>
${p.partnershipInterest}
</p>


<h4>Description</h4>

<p>
${p.description}
</p>

<button
    class="delete-btn"
    onclick="deleteRecord('partners', '${doc.id}')"
>
    Delete Partner
</button>


</div>

`;

});


box.innerHTML=html;


}
///////////////////////////////////////////////////////////////
window.submitPartner = async function(event){

event.preventDefault();


try{


await addDoc(collection(db,"partners"),{


organisation:
p_organisation.value,


contactPerson:
p_contact.value,


email:
p_email.value,


phone:
p_phone.value,



address:{

line1:p_address1.value,

line2:p_address2.value,

town:p_town.value,

county:p_country.value,

postcode:p_postcode.value

},



organisationType:
p_type.value,



partnershipInterest:
p_interest.value,



description:
p_description.value,



experience:
p_experience.value,



consent:true,


createdAt:new Date()


});



alert(
"Thank you. Your partnership application has been submitted."
);



event.target.reset();



}


catch(error){

alert(
"Error submitting partnership application: "
+ error.message
);

}


}
//////////////////////////////////////////////////////
window.deleteRecord = async function(collectionName, documentId) {

    const confirmed = confirm(
        "Are you sure you want to delete this record? This cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, collectionName, documentId)
        );

        alert("Record deleted successfully.");

        // Reload the current section
        if (collectionName === "messages") {
            loadMessages();
        }

        if (collectionName === "partners") {
            loadPartners();
        }

        if (collectionName === "volunteers") {
            loadVolunteers();
        }

    } catch (error) {

        console.error(error);

        alert(
            "Error deleting record: " + error.message
        );

    }
};






////////////////////////////////////////////

/* =========================
   ADMIN LOGIN
========================= */
/*window.login = async function(){


const email = document.getElementById("adminEmail").value.trim();

const password = document.getElementById("adminPassword").value.trim();



if(!email){

alert("Please enter your email address");

return;

}



if(!password){

alert("Please enter your password");

return;

}



try{


const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);



alert("Login successful");



// hide login

document.getElementById("admin")
.classList.add("hidden");



// show dashboard

document.getElementById("dashboard")
.classList.remove("hidden");



}


catch(error){

alert(error.message);

}


}*/
////////////////////////////////////

window.login = async function () {

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Hide all public sections
        document.querySelectorAll(
            "body > section:not(#dashboard), body > footer"
        ).forEach(element => {
            element.classList.add("hidden");
        });

        // Specifically hide Why We Exist
        document
            .getElementById("why-we-exist")
            .classList.add("hidden");

        // Show dashboard
        document
            .getElementById("dashboard")
            .classList.remove("hidden");

        // Close side menu
        document
            .getElementById("sideMenu")
            .classList.remove("open");

        // Go to top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
};


//////////////////////////////////////
/*window.login = async function () {

    const email = adminEmail.value;
    const password = adminPassword.value;

    try {

        const cred = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if(!ADMIN_EMAILS.includes(cred.user.email)){

            alert("Not authorised.");

            await signOut(auth);

            return;

        }

        document.getElementById("admin").classList.add("hidden");


    
       document.getElementById("website").classList.add("hidden");

        document.getElementById("dashboard").classList.remove("hidden");

        loadAdminData();

    }

    catch(err){

        alert(err.message);

    }

}*/
/* =========================
   LOAD ADMIN DATA
========================= */

/*window.loadAdminData = async function () {
    const container = document.getElementById("adminData");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const volunteerSnap = await getDocs(
            query(collection(db, "volunteers"), orderBy("createdAt", "desc"))
        );

        const messageSnap = await getDocs(
            query(collection(db, "messages"), orderBy("createdAt", "desc"))
        );

        let html = "";

        html += "<h3>Volunteers</h3>";
        volunteerSnap.forEach(doc => {
            const d = doc.data();
            html += `
                <div class="card">
                    <strong>${d.name}</strong><br>
                    ${d.email}<br>
                    ${d.phone}<br>
                    <p>${d.motivation}</p>
                </div>
            `;
        });

        html += "<h3>Messages</h3>";
        messageSnap.forEach(doc => {
            const d = doc.data();
            html += `
                <div class="card">
                    <strong>${d.name}</strong><br>
                    ${d.email}<br>
                    <p>${d.message}</p>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (err) {
        container.innerHTML = "<p>Error loading data</p>";
    }
};
*/
window.logout = function () {

    signOut(auth)

    .then(() => {

        // Hide dashboard
        const dashboard = document.getElementById("dashboard");

        if (dashboard) {
            dashboard.classList.add("hidden");
        }


        // Show normal website sections
        const sectionsToShow = [
            "home",
            "what-we-do",
            "about",
            "research",
            "values",
            "impact",
            "partners",
            "volunteer",
            "contact",
            "donate",
            "admin"
        ];

        sectionsToShow.forEach(id => {

            const element = document.getElementById(id);

            if (element) {
                element.classList.remove("hidden");
            }

        });


        // Clear login fields
        const adminEmail = document.getElementById("adminEmail");
        const adminPassword = document.getElementById("adminPassword");

        if (adminEmail) {
            adminEmail.value = "";
        }

        if (adminPassword) {
            adminPassword.value = "";
        }


        // Return to home
        window.location.hash = "#home";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    })

    .catch(error => {

        console.error(error);
        alert(error.message);

    });

};

/* =========================
   LOGOUT (optional)
========================= */
/*window.logout = async function () {

  await signOut(auth);

  document.getElementById("dashboard").classList.add("hidden");

  document.getElementById("admin").classList.remove("hidden");

  // optional: scroll back to top/home
  window.location.hash = "home";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};*/
//////////////////////////////////////


async function getUserRole(uid){

    const userRef = doc(db, "users", uid);

    const snap = await getDoc(userRef);

    if(snap.exists()){
        return snap.data().role;
    }

    return null;
}
///////////////////////////////////////////
window.loadVolunteers = async function(){

    const adminData = document.getElementById("adminData");

    adminData.innerHTML = "Loading volunteers...";


    try {

        const querySnapshot = await getDocs(
            collection(db, "volunteers")
        );


        let html = "<h2>Volunteer Applications</h2>";


        if(querySnapshot.empty){

            html += "<p>No volunteer applications found.</p>";

        }


        querySnapshot.forEach((doc)=>{


            const volunteer = doc.data();


            html += `

            <div class="card">

                <h3>${volunteer.name}</h3>

                <p><strong>Email:</strong> ${volunteer.email}</p>

                <p><strong>Phone:</strong> ${volunteer.phone}</p>


                <h4>Address</h4>

                <p>
                ${volunteer.address1 || ""}
                ${volunteer.address2 || ""}
                </p>

                <p>
                ${volunteer.town || ""}
                ${volunteer.county || ""}
                ${volunteer.postcode || ""}
                </p>


                <h4>Volunteer Information</h4>

                <p>
                <strong>Interested in:</strong>
                ${volunteer.interest || ""}
                </p>


                <p>
                <strong>Skills:</strong>
                ${volunteer.skills || ""}
                </p>


                <p>
                <strong>Availability:</strong>
                ${volunteer.availability || ""}
                </p>


                <p>
                <strong>Motivation:</strong>
                ${volunteer.motivation || volunteer.role || ""}
                </p>


                <p>
                <strong>Status:</strong>
                ${volunteer.status || "Pending"}
                </p>
<button
    class="delete-btn"
    onclick="deleteRecord('volunteers', '${doc.id}')"
>
    Delete Volunteer
</button>

            </div>

            `;


        });


        adminData.innerHTML = html;


    }

    catch(error){

        console.error(error);

        adminData.innerHTML =
        "Error loading volunteers: " + error.message;

    }

};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* VOLUNTEER */
window.submitVolunteer = async function(e){

e.preventDefault();


try{


await addDoc(collection(db,"volunteers"),{


name: v_name.value,

email: v_email.value,

phone: v_phone.value,


address1: v_address1.value,

address2: v_address2.value,

town: v_town.value,

county: v_county.value,

postcode: v_postcode.value,


interest: v_interest.value,

skills: v_skills.value,

availability: v_availability.value,

motivation: v_role.value,


createdAt: new Date(),

status:"Pending"


});


alert("Volunteer application submitted successfully");


e.target.reset();


}

catch(error){

console.error(error);

alert(error.message);

}


};
///////////////////////////////////////////

/* JOB FORM */
let currentJob = "";

window.openJobForm = function (job) {
  currentJob = job;
  jobTitle.innerText = "Apply for " + job;
  jobForm.classList.remove("hidden");
};
/////////////////////////////////////////////////
