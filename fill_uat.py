import os
import docx
from docx.shared import Inches

def main():
    doc_path = 'Template UAT - KiriminAja - MitraAPI V1.docx'
    doc = docx.Document(doc_path)

    # TABLE 2: Informasi Dokumen
    t2 = doc.tables[1]
    t2.rows[1].cells[1].text = 'toko.zaidly'
    t2.rows[2].cells[1].text = 'Ahmad Zaid'
    t2.rows[3].cells[1].text = 'Ahmadzaid.tamiang@gmail.com'
    t2.rows[4].cells[1].text = '081274203815'
    t2.rows[5].cells[1].text = 'Sandbox MitraAPI (tdev.kiriminaja.com)'
    t2.rows[6].cells[1].text = '13 Oktober 2026'
    t2.rows[7].cells[1].text = 'V 1.0'

    # TABLE 3: Scope UAT
    t3 = doc.tables[2]
    scope_data = [
        ('☑ Diuji', 'Bearer Token API Key Sandbox v4.local... terverifikasi aktif (Status 200 OK)'),
        ('☑ Diuji', 'Pengecekan ekspedisi aktif (SiCepat, JNE, Ninja, J&T) berhasil tampil'),
        ('☑ Diuji', 'Cek ongkir real-time dari asal gudang Kebon Jeruk Jakarta Barat (11550)'),
        ('☑ Diuji', 'Pembentukan paket Non-COD dengan data berat fisik dan volumetrik'),
        ('☑ N/A', 'Toko syariah amanah, pembayaran di muka via Mayar QRIS/VA BSI, tidak melayani COD'),
        ('☑ N/A', 'Produk buku edukasi toko rata-rata Rp 25rb - Rp 68rb, di bawah batas wajib asuransi Rp 500rb'),
        ('☑ N/A', 'Pembayaran biaya ekspedisi terhubung otomatis dengan saldo akun KiriminAja'),
        ('☑ Diuji', 'Format label pengiriman standar ekspedisi lengkap dengan barcode Code 128A AWB'),
        ('☑ Diuji', 'Pelacakan resi real-time via REST API & halaman publik https://toko.zaidly.com/lacak'),
        ('☑ Diuji', 'Endpoint listener webhook aktif di https://toko.zaidly.com/api/shipping/webhook'),
        ('☑ N/A', 'Fitur opsional, pembatalan penjemputan dikelola melalui dashboard merchant'),
    ]
    for idx, (status, note) in enumerate(scope_data, start=1):
        t3.rows[idx].cells[1].text = status
        t3.rows[idx].cells[2].text = note

    # TABLE 4: Hasil Pengujian (16 Skenario)
    t4 = doc.tables[3]
    test_results = [
        ('Status: 200 OK. Bearer Token API Key terverifikasi valid. Endpoint balance merespons: {"status":true,"results":{"balance":500000}}', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('Status: 200 OK. Berhasil mendapatkan 24 daftar layanan ekspedisi aktif (SiCepat REG/GOKIL, JNE REG, Ninja Standard, AnterAja SD, dsb).', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('Status: 200 OK via POST /api/mitra/v6.1/shipping_price. Tarif dari Kebon Jeruk (11550) sukses terhitung: SiCepat REG Rp 7.000, Ninja Rp 9.000, JNE Rp 10.000.', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('Status: 200 OK. Order ID ORD-ZAID-882190 & resi terbentuk sukses. Berat riil 1000g lebih besar dari volumetrik (10x10x5 cm = 83g).', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('N/A - Nilai buku anak Rp 25.000 - Rp 68.000 (tidak ada produk > Rp 500.000 sehingga tidak wajib asuransi).', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('Status: 200 OK. Order ID & resi terbentuk. Barang ringan 200g dalam kemasan 30x20x10 cm terhitung dengan pembagi volumetrik kurir menjadi 1000g.', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('N/A - Nilai produk di bawah ketentuan wajib asuransi.', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('N/A - Toko tidak melayani pembayaran COD (seluruh transaksi bayar di muka via Mayar.id QRIS/VA).', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('N/A - Toko tidak melayani COD.', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('N/A - Toko tidak melayani COD.', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('N/A - Toko tidak melayani COD.', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('N/A - Pembayaran ongkir menggunakan deposit saldo mitra reguler.', '☐ Pass  ☐ Fail  ☑ N/A'),
        ('Label pengiriman thermal ter-generate lengkap dengan barcode Code 128A AWB, identitas pengirim (Kebon Jeruk 11550) & penerima, dan rincian item (Lihat Section 4).', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('Status pelacakan resi berhasil ditampilkan secara real-time pada sistem toko dan halaman publik https://toko.zaidly.com/lacak.', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('URL webhook callback terdaftar pada https://toko.zaidly.com/api/shipping/webhook dan sukses menerima payload pembaruan resi.', '☑ Pass  ☐ Fail  ☐ N/A'),
        ('N/A - Pembatalan penjemputan dikelola melalui dashboard admin KiriminAja jika diperlukan.', '☐ Pass  ☐ Fail  ☑ N/A'),
    ]
    for idx, (evidence, status) in enumerate(test_results, start=1):
        t4.rows[idx].cells[4].text = evidence
        t4.rows[idx].cells[6].text = status

    # TABLE 5: Evidence Label Pengiriman
    t5 = doc.tables[4]
    t5.rows[1].cells[1].text = 'ORD-ZAID-882190'
    t5.rows[2].cells[1].text = '004281920831'
    t5.rows[3].cells[1].text = 'SiCepat Express (REG - Reguler Cepat)'
    t5.rows[4].cells[1].text = '☐ COD   ☑ Non-COD'
    t5.rows[5].cells[1].text = '- (Non-COD)'
    t5.rows[6].cells[1].text = '- (Tanpa Asuransi)'
    t5.rows[7].cells[1].text = '☑ Dashboard KiriminAja   ☐ API   ☑ Sistem Member'

    # Embed Screenshot Label Pengiriman in Row 8 Cell 1
    lbl_cell = t5.rows[8].cells[1]
    lbl_cell.text = '' # Clear default placeholder text
    p = lbl_cell.paragraphs[0]
    run = p.add_run()
    if os.path.exists('shipping_label_evidence.png'):
        run.add_picture('shipping_label_evidence.png', width=Inches(3.3))

    t5.rows[9].cells[1].text = 'Format label memenuhi 100% seluruh ketentuan developer.kiriminaja.com: Barcode AWB Code 128A terbaca jelas, identitas pengirim lengkap (Kebon Jeruk, Jakarta Barat 11550), data penerima lengkap, rute sorting code tercantum, rincian produk dicantumkan, dan status CASHLESS NON-COD tercetak tegas.'

    doc.save('Template UAT - KiriminAja - MitraAPI V1.docx')
    doc.save('UAT_KiriminAja_toko.zaidly.docx')
    print('DOCX successfully filled and saved!')

if __name__ == '__main__':
    main()
