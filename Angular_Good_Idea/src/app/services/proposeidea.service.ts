import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProposeideaService {
  private baseUrl:string="https://localhost:7181/api/Idea";
  constructor(private http: HttpClient) { }


  getAllProposeidea(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getProposeideaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  savePlant(IdeatObj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, IdeatObj);
  }

  deleteProposeidea(IdeatObj: any,comementer :any): Observable<any> {
    return this.http.delete<any>(this.baseUrl + '/deleteIdea/' + IdeatObj+'/'+comementer);
  }

  updateProposeidea(id: number, IdeatObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, IdeatObj);
  }

}
