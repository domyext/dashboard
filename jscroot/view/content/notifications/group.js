import { onClick,getValue,setValue,hide,show,onInput } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
import {validatePhoneNumber} from "https://cdn.jsdelivr.net/gh/jscroot/validate@0.0.1/croot.js";
import {postJSON,getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
import { id, backend } from "../../../url/config.js";

export async function main(){
    await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",id.content);
    getJSON(backend.project.anggota,'login',getCookie('login'),getResponseFunction);
    onClick("createGroupButton",actionfunctionname);
    getGroup();
}

function getResponseFunction(result){
    console.log(result);
    if (result.status===200){
        result.data.forEach(group => {
            const option = document.createElement('option');
            option.value = group._id;
            option.textContent = group.groupname;
            document.getElementById('groupNameInput').appendChild(option);
        });

    }else{
        Swal.fire({
            icon: "error",
            title: result.data.status,
            text: result.data.response
          });
    }
}

function actionfunctionname(){
    let event={
        groupname:getValue("groupNameInput"),
    };
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        postJSON(backend.project.postGroup,"login",getCookie("login"),event,responseFunction);
        hide("createGroupButton");
    }  
}

function responseFunction(result){
    if(result.status === 200){
        const katakata = "Selamat kak group "+result.data.groupname+" berhasil dibuat";
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: katakata,
            footer: '<a href="https://wa.me/'+result.data.phone+'?text='+katakata+'" target="_blank">Kirim Pesan</a>',
            didClose: () => {
                setValue("groupNameInput","");
                show("createGroupButton");
            }
          });
    }else{
        Swal.fire({
            icon: "error",
            title: result.data.status,
            text: result.data.response
          });
          show("createGroupButton");
    }
    console.log(result);
}

function getGroup(){
    if (getCookie("login")===""){
        redirect("/signin");
    }else{
        getJSON(backend.project.getGroup,"login",getCookie("login"),responseFunctionGet);
    }  
}


function responseFunctionGet(result) {
    if (result.status === 200 && Array.isArray(result.data)) {
        const container = document.getElementById("groupCardsContainer");

        // Kosongkan container sebelum menambahkan data baru
        container.innerHTML = "";

        // Iterasi data dan tambahkan kartu ke container
        result.data.forEach(group => createGroupCard(container, group));

        Swal.fire({
            icon: "success",
            title: "Groups Loaded",
            text: "Successfully fetched group data.",
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Failed to Load Groups",
            text: result.response || "An error occurred while fetching group data.",
        });
        console.error("Error fetching groups:", result.response || "No additional error information provided.");
    }
}


function createGroupCard(container, group) {
    // Buat elemen kartu utama
    const card = document.createElement("div");
    card.className = "card";
    card.style = `
        margin: 10px; 
        padding: 15px; 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    `;

    // Buat elemen judul kartu
    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = group.groupname || "No Name Provided";
    title.style = `
        margin: 0; 
        font-size: 18px; 
        color: #333;
        font-weight: bold;
    `;

    // Tambahkan isi kartu
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.style = "margin-top: 10px;";

    // // Tambahkan deskripsi jika ada
    // if (group.deskripsi) {
    //     const description = document.createElement("p");
    //     description.className = "card-text";
    //     description.textContent = group.deskripsi;
    //     description.style = `
    //         color: #555; 
    //         font-size: 14px;
    //     `;
    //     cardBody.appendChild(description);
    // }

    // Susun elemen kartu
    cardBody.appendChild(title);
    card.appendChild(cardBody);
    container.appendChild(card);
}