export function upload() {
    
}

export function download(name, data, type) {
    const a = document.createElement("a")
    const file = new Blob([data], {type})
    a.href = URL.createObjectURL(file)
    a.download = name
    a.click()
}