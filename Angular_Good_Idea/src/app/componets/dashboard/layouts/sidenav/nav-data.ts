import{INavbarData} from "./helper"
export const navbarData : INavbarData[] =[
    // {
    //     routeLink:'dashboard',
    //     icon:'fal fa-home',
    //     label:'Dashboard',
    //     role: 'admin,null',
    //     //expanded:true,
    //     // items:[
    //     //   {
    //     //     "routeLink": "plant/plant1",
    //     //    "label": "Plant1",
          
    //     //     items:[
    //     //        {
    //     //          "routeLink": "plant/plant2",
    //     //          "label": "Plant1",
    //     //        }
    //     //      ]
    //     //    }
    //     //  ]
    // },
    {
      routeLink:'proposeidea',
      icon:'fal fa-tags',
      label:'Propose Idea',  role: 'admin,null'
     
    },
    {
      routeLink:'Test',
      icon:'fal fa-tags',
      label:'Test',  role: 'admin,null'
     
    }
  //   {
  //     routeLink:'idea',
  //     icon:'fal fa-tags',
  //     label:'Propose Idea 2',
  //     role: 'admin,null',
  //   },
  //   {
  //     routeLink:'plant',
  //     icon:'fal fa-chart-bar',
  //     label:'Plant',
  //     role: 'admin',
  // },
  //   {
  //     routeLink:'departement',
  //     icon:'fal fa-box-open',
  //     label:'Departement',
  //     role: 'admin,null',
  //   }
  ,
    // {
    //   "routeLink": "area",
    //   "icon": "fal fa-tags",
    //   "label": "Area",
    //   role: 'admin,null,string',
    //   expanded:true,
    //   "items": [
    //     {
    //       "routeLink": "area/molding",
    //       "label": "Molding"
          
    //     },
    //     {
    //       "routeLink": "area/connectorAssembly",
    //       "label": "Connector Assembly"
    //     },
    //     {
    //       "routeLink": "area/cableAssembly",
          
    //       "label": "Cable_Assembly"
    //     }
    //   ]
    // },
    // {
    //   routeLink:'allideas',
    //   icon:'fal fa-box-open',
    //   label:'All ideas',
    //   role: 'admin,null',
    // },
    // {
    //   routeLink:'ideaowner',
    //   icon:'fal fa-box-open',
    //   label:'Idea Owner',
    //   role: 'admin,null',
    // },


    
    {
      "routeLink": "managerresources",
      "icon": "fal fa-tags",
      "label": "Manager Resources",
        role: 'admin',
        expanded:true,
        "items": [
          {
            "routeLink": "managerresources/users",
            "label": "Users"
            
          }
        ]
    },
    {
      "routeLink": "masterdata",
      "icon": "fal fa-tags",
      "label": "Master Data",
      role: 'admin',
      expanded:true,
    }
      
    
];