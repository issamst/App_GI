import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {
  @Input() collapsed =false;
  @Input() screemWidth = 0 ;



  getBodyClass(): string {
    let styleClass=''
    if(this.collapsed &&  this.screemWidth >768){
      styleClass='body-trimmed';
    }else if(this.collapsed && this.screemWidth<=768 && this.screemWidth>0){
      styleClass='body-md-screen';
    }
    return styleClass;
  }
}
