export function upload(file, resolve = () => {}) {
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => resolve(reader.result)
    reader.readAsText(file)
}

export function download(name, data, type) {
    const a = document.createElement("a")
    const file = new Blob([data], {type})
    a.href = URL.createObjectURL(file)
    a.download = name
    a.click()
}