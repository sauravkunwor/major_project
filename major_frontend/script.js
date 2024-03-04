const file = document.getElementById("file-input");
const submitButton = document.getElementById("submit");
const copyButton = document.getElementById("copy-poem");
const input = document.getElementById("image-input");
const drag = document.getElementById("drag");
const image = document.getElementById("uploaded-image");
const poem = document.getElementById("poem");

const submit_button = document.getElementById("submit_button")

let FILE = null;

//Getting User input when clicked on the box    
input.addEventListener("click", (_) => {
    file.click();
})

// Getting image and showing to user
file.addEventListener("change", (e) => {
    if (FILE && (FILE.name === e.target.files[0].name)) {
        file.value = null
        return
    }
    FILE = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => image.setAttribute("src", e.target.result);
    fileReader.readAsDataURL(FILE);
    image.classList.remove("hidden")
    drag.classList.add("hidden")
    submitButton.classList.remove("hidden")
})

// Submitting the image to Server
submitButton.addEventListener("click", async (_) => {
    try {
        if (!FILE) throw new Error("No image uploaded")
        poem.innerText = null
        submit_button.setAttribute("disabled", true)
        submit_button.innerText = "Generating Poem..."
        const formData = new FormData();
        formData.append("image", FILE);
        const res = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData
        })
        const data = await res.json()
        poem.innerText = data.message.trim()
        copyButton.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
        console.log(error)
        alert(error.message)
    }finally{
        submit_button.innerText = "Generate Poem"
        submit_button.removeAttribute("disabled")
    }
});

// Copying poem to user's clipboard
copyButton.addEventListener("click", (_) => {
    navigator.clipboard.writeText(poem.innerText).catch(e => { alert("Error copying text") })
})