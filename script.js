let DaftarWarung=JSON.parse(localStorage.getItem("WarungData"))||[];
let DaftarProduk=JSON.parse(localStorage.getItem("ProdukData"))||[];

function formatRupiah(angka){
    return "Rp"+parseInt(angka).toLocaleString("id-ID");
}

function renderAll(){
    const ListWarung=document.getElementById("ListWarung");
    const ListProduk=document.getElementById("ListProduk");
    const selectWarung=document.getElementById("ProdukWarungId");

    ListWarung.innerHTML="";
    ListProduk.innerHTML="";
    selectWarung.innerHTML=`<option value=""disabled selected>Pilih Warung...</option>`;

    DaftarWarung.forEach((w, index)=>{
        ListWarung.innerHTML+=`
        <li>
        <strong>${w.nama}</strong>-${w.alamat}
        <button onclick="HapusWarung(${index})"style="background:red">Hapus</button>
        </li>`;
        selectWarung.innerHTML+=`<option value="${w.id}">${w.nama}</option>`;
    });

    DaftarProduk.forEach((p, index)=>{
        const warung=DaftarWarung.find(w=> w.id==p.warungId);
        ListProduk.innerHTML+=`
        <li>
        <strong>${p.nama}</strong>-${formatRupiah(p.harga)}
        (Stok:${p.stok})
        <br><smalll>Warung:${warung?warung.nama:'Umum'}></small>
        <button onclick="BeliProduk(${index})">Beli</button>
        <button onclick="HapusProduk(${index})"style="background:red">Hapus</button>
        </li>`;
    });
}

function TambahWarung(){
    const nama=document.getElementById("WarungNama").value;
    const alamat=document.getElementById("WarungAlamat").value;
    const pemilik=document.getElementById("WarungPemilik").value;

    if(!nama||!alamat)
        return alert("Isi Data Dulu");
    const baru={id:"W-"+Date.now(), nama,alamat, pemilik};
    DaftarWarung.push(baru);
    saveAndRender();
}

function TambahProduk(){
    const warungId=document.getElementById("ProdukWarungId").value;
    const nama=document.getElementById("ProdukNama").value;
    const harga=document.getElementById("ProdukHarga").value;
    const stok=document.getElementById("ProdukStok").value;

    if(!warungId||!nama||isNaN(harga)||isNaN(stok)){
        return alert("Lengkapi Data Produk");
    }
    const baru={warungId, nama, harga:parseInt(harga),stok:parseInt(stok)};
    DaftarProduk.push(baru);
    alert("Produk berhasil ditambahkan");
    saveAndRender();
}

function BeliProduk(index){
    let p = DaftarProduk[index];
    let jumlah = prompt("Masukkan jumlah beli:");
    jumlah = parseInt(jumlah);

    if(isNaN(jumlah) || jumlah <= 0){
        alert("Jumlah tidak valid!");
        return;
    }
    if(jumlah > p.stok){
        alert("Stok tidak cukup!");
        return;
    }
    let total = Math.floor(p.harga * jumlah);
    let totalAkhir = total;
    let NamaProduk=p.nama.toUpperCase();
    if(confirm(`Beli ${p.nama}
        Total: ${formatRupiah(total)}
        Total Akhir: ${formatRupiah(totalAkhir)}`)){
        p.stok -= jumlah;
        
        saveAndRender();
    }
}
function HapusWarung(index){
    if(confirm("Hapus Warung Ini?Produk Didalamnya Mungkin Tetap Ada.")){
        DaftarWarung.splice(index, 1);
        saveAndRender();
    }
}

function HapusProduk(index){
    if(confirm("Hapus produk ini?")){
    DaftarProduk.splice(index, 1);
    saveAndRender();
}
}

function saveAndRender(){
    localStorage.setItem("WarungData",JSON.stringify(DaftarWarung));
    localStorage.setItem("ProdukData",JSON.stringify(DaftarProduk));
    renderAll();
}

document.getElementById("TambahWarung").onclick=TambahWarung;
document.getElementById("TambahProduk").onclick=TambahProduk;

renderAll();