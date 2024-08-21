import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { BleClient, BleService, BluetoothLe, textToDataView } from '@capacitor-community/bluetooth-le';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatting number source:
 * https://chatgpt.com/share/2837b95f-1942-41cc-b938-5b4301ec9e88 -- Parse non number input (NaN)
 * https://chatgpt.com/share/b12cd87b-9b57-4295-a6d6-9702aaff065e -- Number format in Angular (Pipe)
 */
@Component({
  selector: 'app-sales-edit',
  templateUrl: './sales-edit.page.html',
  styleUrls: ['./sales-edit.page.scss'],
})
export class SalesEditPage implements OnInit {
  public sales_cust_id: number = 0;
  public sales_cust_name: any = '';
  public sales_nomor_nota: any;
  public doc_kode_nota_terakhir: number = 0;
  public doc_no_nota: any;
  public input_payment_type: any;
  public input_BB: any;
  public input_credit: any;
  // SJE
  public input_item1qty: any;
  public input_item2qty: any;
  public input_item3qty: any;
  public input_item4qty: any;
  public input_item5qty: any;
  
  public input_item1total: any = 0;
  public input_item2total: any = 0;
  public input_item3total: any = 0;
  public input_item4total: any = 0;
  public input_item5total: any = 0;
  // free
  public input_item1qtyfree: any;
  public input_item2qtyfree: any;
  public input_item3qtyfree: any;
  public input_item4qtyfree: any;
  public input_item5qtyfree: any;
  
  public input_item1totalfree: any = 0;
  public input_item2totalfree: any = 0;
  public input_item3totalfree: any = 0;
  public input_item4totalfree: any = 0;
  public input_item5totalfree: any = 0;
  // retur
  public input_item1qtyretur: any;
  public input_item2qtyretur: any;
  public input_item3qtyretur: any;
  public input_item4qtyretur: any;
  public input_item5qtyretur: any;
  
  public input_item1totalretur: any = 0;
  public input_item2totalretur: any = 0;
  public input_item3totalretur: any = 0;
  public input_item4totalretur: any = 0;
  public input_item5totalretur: any = 0;
  // price
  public input_item1price: any;
  public input_item2price: any;
  public input_item3price: any;
  public input_item4price: any;
  public input_item5price: any;
  // total bawah
  public input_totalkg: any;
  public input_totalkeseluruhan: any;
  public input_totalfree: any;
  public input_totalretur: any;

  public item1_name: string = '';
  public item2_name: string = '';
  public item3_name: string = '';
  public item4_name: string = '';
  public item5_name: string = '';

  public ware_id: number = 0;

  route_no: string = '';
  
  DaftarSalesItem : {cust_order: number, cust_id: number, cust_name: string, cust_remark: string, cust_type: number,
    payment_type: number, nilai_BB: number, nilai_credit: number,
    item1_qty: number, item2_qty: number, item3_qty: number, item4_qty: number, item5_qty: number,
    item1_qtyfree: number, item2_qtyfree: number, item3_qtyfree: number, item4_qtyfree: number, item5_qtyfree: number,
    item1_qtyretur: number, item2_qtyretur: number, item3_qtyretur: number, item4_qtyretur: number, item5_qtyretur: number,
    item1_price: number, item2_price: number, item3_price: number, item4_price: number, item5_price: number,
    cust_edited: number, cust_added: number, nomor_nota: string}[] = [];

  deviceId:any = '';
  serviceUuid:any = '';
  characteristicUuid:any = '';

  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private route: Router,
    private nav:NavController) { }

  async ngOnInit() {
    await this.storage.create();
    // this.presentToast("sales_cust_id : "+this.sales_cust_id);
  }
  
  async ionViewDidEnter(){
    const loadingIndicator = await this.showLoadingIndictator();

    this.ware_id = await this.storage.get('userlogin_wareid');
    this.sales_cust_id = await this.storage.get('sales_cust_id');
    this.sales_cust_name = await this.storage.get('sales_cust_name');

    this.sales_nomor_nota = await this.storage.get('sales_nomor_nota');
    // JIka sales_nomor_nota kosong, tampilkan dgn nomor terakhir 
    if(this.sales_nomor_nota == '')
      {
        this.route_no = await this.storage.get('userlogin_routeno');
        this.doc_no_nota = await this.storage.get('doc_no_nota');
        this.doc_kode_nota_terakhir = parseInt(await this.storage.get('doc_kode_nota_terakhir'));
        this.sales_nomor_nota =
          this.route_no + '-' + this.doc_no_nota + '-' + ('000'+(this.doc_kode_nota_terakhir+1).toString()).substr(-3,3);
      }

    this.input_payment_type = await this.storage.get('sales_payment_type');
    this.input_BB = await this.storage.get('sales_nilai_BB');
    this.input_BB = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.input_BB);
    this.input_credit = await this.storage.get('sales_nilai_credit');
    this.input_credit = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.input_credit);

    this.input_item1qty = await this.storage.get('sales_nilai_item1qty');
    this.input_item2qty = await this.storage.get('sales_nilai_item2qty');
    this.input_item3qty = await this.storage.get('sales_nilai_item3qty');
    this.input_item4qty = await this.storage.get('sales_nilai_item4qty');
    this.input_item5qty = await this.storage.get('sales_nilai_item5qty');
    this.input_item1qtyfree = await this.storage.get('sales_nilai_item1qtyfree');
    this.input_item2qtyfree = await this.storage.get('sales_nilai_item2qtyfree');
    this.input_item3qtyfree = await this.storage.get('sales_nilai_item3qtyfree');
    this.input_item4qtyfree = await this.storage.get('sales_nilai_item4qtyfree');
    this.input_item5qtyfree = await this.storage.get('sales_nilai_item5qtyfree');
    this.input_item1qtyretur = await this.storage.get('sales_nilai_item1qtyretur');
    this.input_item2qtyretur = await this.storage.get('sales_nilai_item2qtyretur');
    this.input_item3qtyretur = await this.storage.get('sales_nilai_item3qtyretur');
    this.input_item4qtyretur = await this.storage.get('sales_nilai_item4qtyretur');
    this.input_item5qtyretur = await this.storage.get('sales_nilai_item5qtyretur');
    this.input_item1price = await this.storage.get('sales_nilai_item1price');
    this.input_item2price = await this.storage.get('sales_nilai_item2price');
    this.input_item3price = await this.storage.get('sales_nilai_item3price');
    this.input_item4price = await this.storage.get('sales_nilai_item4price');
    this.input_item5price = await this.storage.get('sales_nilai_item5price');
    
    this.input_item1total = this.input_item1qty * this.input_item1price;
    this.input_item2total = this.input_item2qty * this.input_item2price;
    this.input_item3total = this.input_item3qty * this.input_item3price;
    this.input_item4total = this.input_item4qty * this.input_item4price;
    this.input_item5total = this.input_item5qty * this.input_item5price;
    
    this.input_item1totalfree = this.input_item1qtyfree * this.input_item1price;
    this.input_item2totalfree = this.input_item2qtyfree * this.input_item2price;
    this.input_item3totalfree = this.input_item3qtyfree * this.input_item3price;
    this.input_item4totalfree = this.input_item4qtyfree * this.input_item4price;
    this.input_item5totalfree = this.input_item5qtyfree * this.input_item5price;
    
    this.input_item1totalretur = this.input_item1qtyretur * this.input_item1price;
    this.input_item2totalretur = this.input_item2qtyretur * this.input_item2price;
    this.input_item3totalretur = this.input_item3qtyretur * this.input_item3price;
    this.input_item4totalretur = this.input_item4qtyretur * this.input_item4price;
    this.input_item5totalretur = this.input_item5qtyretur * this.input_item5price;
    
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.input_totalkeseluruhan);
    
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.input_totalfree);
    
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(this.input_totalretur);
    
    this.storage.get('DaftarSalesItem').then((val) => {
      
      this.DaftarSalesItem = val;
    });

    // Daftar nama item dinamis
    this.storage.get('DaftarNamaItem').then((val) => {
      
      this.item1_name = val[0]['item1_name'];
      this.item2_name = val[0]['item2_name'];
      this.item3_name = val[0]['item3_name'];
      this.item4_name = val[0]['item4_name'];
      this.item5_name = val[0]['item5_name'];
    });

    loadingIndicator.dismiss();
  }

  // On Change input form - START
  // Remove leading zeros : https://chatgpt.com/share/6260bdde-646c-4adb-997c-067ed219b185
  onBBChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    // this.input_BB = value;
    
    // Parse the input value as a number
    let numericValue = parseFloat(value.replaceAll(',',''));
    
    // Check if numericValue is a valid number
    console.log(isNaN(numericValue));
    if (!isNaN(numericValue)) {
      // Format the number
      this.input_BB = 
      Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numericValue);
    } else {
      this.input_BB = '0'; // Or handle it as you wish
    }
  }
  onCreditChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    // this.input_credit = value;
    
    // Parse the input value as a number
    let numericValue = parseFloat(value.replaceAll(',',''));
    
    // Check if numericValue is a valid number
    console.log(isNaN(numericValue));
    if (!isNaN(numericValue)) {
      // Format the number
      this.input_credit = 
      Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numericValue);
    } else {
      this.input_credit = '0'; // Or handle it as you wish
    }
  }
  // item 1
  onItem1QtyChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1qty = value;
    this.input_item1total = this.input_item1qty * this.input_item1price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
  }
  onItem1QtyFreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1qtyfree = value;
    this.input_item1totalfree = this.input_item1qtyfree * this.input_item1price;
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
  
    // formatting
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
  }
  onItem1QtyReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1qtyretur = value;
    this.input_item1totalretur = this.input_item1qtyretur * this.input_item1price;
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
  
    // formatting
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  onItem1PriceChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item1price = value;
    this.input_item1total = this.input_item1qty * this.input_item1price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  // item 2
  onItem2QtyChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2qty = value;
    this.input_item2total = this.input_item2qty * this.input_item2price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
  }
  onItem2QtyFreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2qtyfree = value;
    this.input_item2totalfree = this.input_item2qtyfree * this.input_item2price;
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
  
    // formatting
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
  }
  onItem2QtyReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2qtyretur = value;
    this.input_item2totalretur = this.input_item2qtyretur * this.input_item2price;
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
  
    // formatting
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  onItem2PriceChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item2price = value;
    this.input_item2total = this.input_item2qty * this.input_item2price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  // item 3
  onItem3QtyChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3qty = value;
    this.input_item3total = this.input_item3qty * this.input_item3price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
  }
  onItem3QtyFreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3qtyfree = value;
    this.input_item3totalfree = this.input_item3qtyfree * this.input_item3price;
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
  
    // formatting
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
  }
  onItem3QtyReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3qtyretur = value;
    this.input_item3totalretur = this.input_item3qtyretur * this.input_item3price;
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
  
    // formatting
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  onItem3PriceChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item3price = value;
    this.input_item3total = this.input_item3qty * this.input_item3price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  // item 4
  onItem4QtyChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4qty = value;
    this.input_item4total = this.input_item4qty * this.input_item4price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
  }
  onItem4QtyFreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4qtyfree = value;
    this.input_item4totalfree = this.input_item4qtyfree * this.input_item4price;
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
  
    // formatting
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
  }
  onItem4QtyReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4qtyretur = value;
    this.input_item4totalretur = this.input_item4qtyretur * this.input_item4price;
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
  
    // formatting
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  onItem4PriceChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item4price = value;
    this.input_item4total = this.input_item4qty * this.input_item4price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  // item 5
  onItem5QtyChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5qty = value;
    this.input_item5total = this.input_item5qty * this.input_item5price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
  }
  onItem5QtyFreeChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5qtyfree = value;
    this.input_item5totalfree = this.input_item5qtyfree * this.input_item5price;
    this.input_totalfree = this.input_item1totalfree + this.input_item2totalfree + this.input_item3totalfree + this.input_item4totalfree + this.input_item5totalfree;
  
    // formatting
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
  }
  onItem5QtyReturChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5qtyretur = value;
    this.input_item5totalretur = this.input_item5qtyretur * this.input_item5price;
    this.input_totalretur = this.input_item1totalretur + this.input_item2totalretur + this.input_item3totalretur + this.input_item4totalretur + this.input_item5totalretur;
  
    // formatting
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  onItem5PriceChange(event: any): void {
    let value = event.detail.value;

    // Remove leading zero
    if (value.length == 2 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // Update the model value
    this.input_item5price = value;
    this.input_item5total = this.input_item5qty * this.input_item5price;
    this.input_totalkeseluruhan = this.input_item1total + this.input_item2total + this.input_item3total + this.input_item4total + this.input_item5total;
  
    // formatting
    let input_totalkeseluruhanNum = parseFloat(this.input_totalkeseluruhan);
    this.input_totalkeseluruhan = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalkeseluruhanNum);
    let input_totalfreeNum = parseFloat(this.input_totalfree);
    this.input_totalfree = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalfreeNum);
    let input_totalreturNum = parseFloat(this.input_totalretur);
    this.input_totalretur = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(input_totalreturNum);
  }
  // on changed - END

  async salesCustEdit(cust_id:number)
  {
    this.storage.set('sales_cust_edit_id', cust_id);
    const loadingIndicator = await this.showLoadingIndictator();
    this.nav.navigateForward('/sales-cust-edit');
    loadingIndicator.dismiss();
  }
  async save()
  {
    
    // const loadingIndicator = await this.showLoadingIndictator();

    const sales_cust_id = this.sales_cust_id;
    const sales_cust_name = this.sales_cust_name;
    const input_payment_type = this.input_payment_type ? this.input_payment_type : 0;
    const input_BB = this.input_BB ? this.input_BB : 0;
    const input_credit = this.input_credit ? this.input_credit : 0;
    const input_item1qty = this.input_item1qty ? this.input_item1qty : 0;
    const input_item2qty = this.input_item2qty ? this.input_item2qty : 0;
    const input_item3qty = this.input_item3qty ? this.input_item3qty : 0;
    const input_item4qty = this.input_item4qty ? this.input_item4qty : 0;
    const input_item5qty = this.input_item5qty ? this.input_item5qty : 0;
    const input_item1qtyfree = this.input_item1qtyfree ? this.input_item1qtyfree : 0;
    const input_item2qtyfree = this.input_item2qtyfree ? this.input_item2qtyfree : 0;
    const input_item3qtyfree = this.input_item3qtyfree ? this.input_item3qtyfree : 0;
    const input_item4qtyfree = this.input_item4qtyfree ? this.input_item4qtyfree : 0;
    const input_item5qtyfree = this.input_item5qtyfree ? this.input_item5qtyfree : 0;
    const input_item1qtyretur = this.input_item1qtyretur ? this.input_item1qtyretur : 0;
    const input_item2qtyretur = this.input_item2qtyretur ? this.input_item2qtyretur : 0;
    const input_item3qtyretur = this.input_item3qtyretur ? this.input_item3qtyretur : 0;
    const input_item4qtyretur = this.input_item4qtyretur ? this.input_item4qtyretur : 0;
    const input_item5qtyretur = this.input_item5qtyretur ? this.input_item5qtyretur : 0;
    const input_item1price = this.input_item1price ? this.input_item1price : 0;
    const input_item2price = this.input_item2price ? this.input_item2price : 0;
    const input_item3price = this.input_item3price ? this.input_item3price : 0;
    const input_item4price = this.input_item4price ? this.input_item4price : 0;
    const input_item5price = this.input_item5price ? this.input_item5price : 0;
    
    const nomor_nota = this.sales_nomor_nota;

    this.DaftarSalesItem.map(function(val, index){
 
      // if(
      //   (val['cust_id'] === sales_cust_id && sales_cust_id !== 0)
      //   ||
      //   (val['cust_name'] == sales_cust_name && sales_cust_id == 0)
      // )
      if(val['cust_id'] === sales_cust_id)
        {
          if(val['nomor_nota'] == '')
            {
              val['nomor_nota'] = nomor_nota;
            }
          val['payment_type'] = parseInt(input_payment_type);
          val['nilai_BB'] = parseInt(input_BB.replaceAll(',',''));
          val['nilai_credit'] = parseInt(input_credit.replaceAll(',',''));
          val['item1_qty'] = parseInt(input_item1qty);
          val['item2_qty'] = parseInt(input_item2qty);
          val['item3_qty'] = parseInt(input_item3qty);
          val['item4_qty'] = parseInt(input_item4qty);
          val['item5_qty'] = parseInt(input_item5qty);
          val['item1_qtyfree'] = parseInt(input_item1qtyfree);
          val['item2_qtyfree'] = parseInt(input_item2qtyfree);
          val['item3_qtyfree'] = parseInt(input_item3qtyfree);
          val['item4_qtyfree'] = parseInt(input_item4qtyfree);
          val['item5_qtyfree'] = parseInt(input_item5qtyfree);
          val['item1_qtyretur'] = parseInt(input_item1qtyretur);
          val['item2_qtyretur'] = parseInt(input_item2qtyretur);
          val['item3_qtyretur'] = parseInt(input_item3qtyretur);
          val['item4_qtyretur'] = parseInt(input_item4qtyretur);
          val['item5_qtyretur'] = parseInt(input_item5qtyretur);
          val['item1_price'] = parseInt(input_item1price);
          val['item2_price'] = parseInt(input_item2price);
          val['item3_price'] = parseInt(input_item3price);
          val['item4_price'] = parseInt(input_item4price);
          val['item5_price'] = parseInt(input_item5price);
        }

    });
    
    this.storage.set('DaftarSalesItem',this.DaftarSalesItem);

    // console.log(this.doc_kode_nota_terakhir);

    this.storage.set('doc_kode_nota_terakhir', this.doc_kode_nota_terakhir+1);
    
    //loadingIndicator.dismiss();
    
  }
  async saveOnly()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    await this.save();
    this.presentToast("Save success");
    loadingIndicator.dismiss();
  }
  async saveAndBack()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    await this.save();
    
    this.route.navigate(['/sales'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }
  async saveAndPrint()
  {
    // const loadingIndicator = await this.showLoadingIndictator();
    await this.save();

    await this.print();
    // loadingIndicator.dismiss();
  }
  /*async cancel()
  {
    const loadingIndicator = await this.showLoadingIndictator();
    this.route.navigate(['/sales'], { replaceUrl: true });
    loadingIndicator.dismiss();
  }*/

  async searchPrinter() {
    await this.VerifyAndEnabled();
    await this.Initialize();

    let bleDevice = await BleClient.requestDevice({ allowDuplicates: false });
    if (bleDevice) {
      const loadingIndicator = await this.showLoadingIndictator();
      await BleClient.connect(bleDevice.deviceId, this.Disconnect);
      await this.storage.set('SYS_PRINTER_DEVICE_ID',bleDevice.deviceId);

      await this.AssignServices();
      
      this.presentToast('Koneksi dengan Printer berhasil');
      loadingIndicator.dismiss();
    }
  }
  
  // PRINTER BLE
  async print(){
    const loadingIndicator = await this.showLoadingIndictator();
    let loadingIndicator2;

    this.deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
    this.serviceUuid = await this.storage.get('SYS_PRINTER_SERVICE_UUID');
    this.characteristicUuid = await this.storage.get('SYS_PRINTER_CHARACTERISTIC_UUID');

    // search printer jika belum connect (blm dapat deviceId)
    if(!this.deviceId)
    {
      loadingIndicator.dismiss();
      this.presentToast('Anda belum memiliki koneksi dengan printer.')
      await this.searchPrinter();
      
      loadingIndicator2 = await this.showLoadingIndictator();
      this.deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
      this.serviceUuid = await this.storage.get('SYS_PRINTER_SERVICE_UUID');
      this.characteristicUuid = await this.storage.get('SYS_PRINTER_CHARACTERISTIC_UUID');

    }
    else
    {
      await this.VerifyAndEnabled();
      await this.Initialize();
  
      try {
        await BleClient.connect(this.deviceId, this.Disconnect);
      }
      catch (error) {
        this.presentToast('Koneksi dengan Printer gagal!');
        loadingIndicator.dismiss();
      }

      // loadingIndicator2 = await this.showLoadingIndictator();
      await this.AssignServices();
      this.presentToast('Koneksi dengan Printer berhasil');
      
    }

    // console.log('Yes man!');
    // console.log(this.deviceId)
    // console.log(this.serviceUuid)
    // console.log(this.characteristicUuid)
    
    // console.log((1234567.89).toLocaleString('en-us', {minimumFractionDigits: 2}));

    
    await this.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    // await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);

    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, '************ UNIT ICE **********');
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, '---------CUSTOMER RECEIPT-------');
    await this.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.FeedLeft(this.deviceId, this.serviceUuid, this.characteristicUuid);
    
    const currentDate = formatDate(new Date(), "dd/MM/yyyy hh:mm a", "en");
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, currentDate);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      this.sales_cust_name);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      'No: '+this.sales_nomor_nota);
    
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');
    // console.log(this.input_item1qty);

    let message = '';
    let message1 = '';
    let message2 = '';
    let message3 = '';
    if(this.input_item1qty ? this.input_item1qty : 0 > 0)
    {
      message1 = this.item1_name.trim();
      message2 = this.input_item1price.toLocaleString('en-us', {minimumFractionDigits: 0})
      +' x '+this.input_item1qty.toLocaleString('en-us', {minimumFractionDigits: 0});
      message3 = this.input_item1total.toLocaleString('en-us', {minimumFractionDigits: 0});

      message = this.getPrintTextPerItem(message1, message2, message3);
      
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);

    }
    
    if(this.input_item2qty ? this.input_item2qty : 0 > 0)
    {
      message1 = this.item2_name.trim();
      message2 = this.input_item2price.toLocaleString('en-us', {minimumFractionDigits: 0})
      +' x '+this.input_item2qty.toLocaleString('en-us', {minimumFractionDigits: 0});
      message3 = this.input_item2total.toLocaleString('en-us', {minimumFractionDigits: 0});

      message = this.getPrintTextPerItem(message1, message2, message3);
      
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);

    }

    if(this.input_item3qty ? this.input_item3qty : 0 > 0)
    {
      message1 = this.item3_name.trim();
      message2 = this.input_item3price.toLocaleString('en-us', {minimumFractionDigits: 0})
      +' x '+this.input_item3qty.toLocaleString('en-us', {minimumFractionDigits: 0});
      message3 = this.input_item3total.toLocaleString('en-us', {minimumFractionDigits: 0});

      message = this.getPrintTextPerItem(message1, message2, message3);
      
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);

    }

    if(this.input_item4qty ? this.input_item4qty : 0 > 0)
    {
      message1 = this.item4_name.trim();
      message2 = this.input_item4price.toLocaleString('en-us', {minimumFractionDigits: 0})
      +' x '+this.input_item4qty.toLocaleString('en-us', {minimumFractionDigits: 0});
      message3 = this.input_item4total.toLocaleString('en-us', {minimumFractionDigits: 0});

      message = this.getPrintTextPerItem(message1, message2, message3);
      
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);

    }

    if(this.input_item5qty ? this.input_item5qty : 0 > 0)
    {
      message1 = this.item5_name.trim();
      message2 = this.input_item5price.toLocaleString('en-us', {minimumFractionDigits: 0})
      +' x '+this.input_item5qty.toLocaleString('en-us', {minimumFractionDigits: 0});
      message3 = this.input_item5total.toLocaleString('en-us', {minimumFractionDigits: 0});

      message = this.getPrintTextPerItem(message1, message2, message3);
      
      await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);

    }

    await this.TurnOnBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.UnderLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    message1 = 'TOTAL';
    message2 = this.input_totalkeseluruhan.toLocaleString('en-us', {minimumFractionDigits: 0});
    message = this.getPrintTextTotal(message1, message2);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, message);
    await this.TurnOffBold(this.deviceId, this.serviceUuid, this.characteristicUuid);
    
    // await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');
    
    await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "Please Collect your receipt.");
    await this.FeedCenter(this.deviceId, this.serviceUuid, this.characteristicUuid);
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid, "---Thank you---");
    
    // await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    // await this.NewEmptyLine(this.deviceId, this.serviceUuid, this.characteristicUuid);
    
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');
    await this.WriteData(this.deviceId, this.serviceUuid, this.characteristicUuid,
      '');

    await this.Disconnect(this.deviceId);
    
    loadingIndicator.dismiss();
    loadingIndicator2?.dismiss();
    this.presentToast('Print selesai.')
  }

  getPrintTextPerItem(msg1:string, msg2:string, msg3:string)
  {
    let msg1_space = '';
    let msg1_len = 0;
    let msg2_space = '';
    let msg2_len = 0;
    let msg3_space = '';
    let msg3_len = 0;
    let x = 0;

    msg1_len = msg1.length;
    msg2_len = msg2.length;
    msg3_len = msg3.length;
    
    if(msg1_len < 5)
    {
      for(x = 5-msg1_len; x > 0; x--) {
        msg1_space = msg1_space+" ";
      }
    }
    if(msg2_len < 14)
    {
      for(x = 14-msg2_len; x > 0; x--) {
        msg2_space = msg2_space+" ";
      }
    }
    msg3_space = msg3_space+"=";
    if(msg3_len < 12)
    {
      for(x = 12-msg3_len; x > 0; x--) {
        msg3_space = msg3_space+" ";
      }
    }

    return msg1+msg1_space+msg2+msg2_space+msg3_space+msg3;
  }
  getPrintTextTotal(msg1:string, msg2:string)
  {
    let msg1_space = '';
    let msg1_len = 0;
    let x = 0;

    msg1_len = msg1.length + msg2.length;
    
    if(msg1_len < 32)
    {
      for(x = 32-msg1_len; x > 0; x--) {
        msg1_space = msg1_space+" ";
      }
    }

    return msg1+msg1_space+msg2;
  }

  async AssignServices() {
    console.log('AssignServices -- start')
    const deviceId = await this.storage.get('SYS_PRINTER_DEVICE_ID');
    let bleService: BleService[] = await BleClient.getServices(deviceId);
    if (bleService.length > 0 && bleService[0].characteristics.length > 0) {
      this.storage.set('SYS_PRINTER_SERVICE_UUID', bleService[0].uuid);
      this.storage.set('SYS_PRINTER_CHARACTERISTIC_UUID', bleService[0].characteristics[0].uuid);
    }
    console.log('AssignServices -- end')
  }

  async Initialize() {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  async Connect(deviceId: string) {
    await BleClient.connect(deviceId);
  }

  async Disconnect(deviceId: string) {
    await BleClient.disconnect(deviceId);
  }

  async VerifyAndEnabled() {
    if (!await BleClient.isEnabled()) {
      await BleClient.enable();
    }
  }

  async LineFeed(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView((new Uint8Array([10])).buffer));
  }

  async TurnOnBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOn = new Uint8Array([27, 69, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOn.buffer));
  }

  async TurnOffBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOff = new Uint8Array([27, 69, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOff.buffer));
  }

  async FeedLeft(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const left = new Uint8Array([27, 97, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(left.buffer));
  }

  async FeedCenter(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const center = new Uint8Array([27, 97, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(center.buffer));
  }

  async FeedRight(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const right = new Uint8Array([27, 97, 2]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(right.buffer));
  }

  async WriteData(deviceId: string, serviceUuid: string, characteristicUuid: string, text: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(text));
  }

  async UnderLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView('-'.repeat(32)));
  }

  async NewEmptyLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(`${' '.repeat(18)}\n`));
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
  async presentToast(Message: string) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

}
