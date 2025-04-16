function base64ToFile(base64: any, fileName = 'upload.bin') {
    const arr = base64.split(',');
    const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1] || arr[0]); // اگه header نداشت، کل base64 رو بگیر
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], fileName, { type: mime });
}
export default base64ToFile