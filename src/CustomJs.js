export function CheckPhone(NoTelp, judul, KodeNegara){
    try
    {
      
      if(NoTelp != undefined)
      {
        if (NoTelp.length > 0)
        {
          if(NoTelp.charAt(0) == '0')
          {
            alert('first digit ' + judul + ' can not 0');
            return false;
          }

          if(NoTelp.length < 7)
          {
            alert('min length ' + judul + ' is 7');
            return false;
          }
          
          if(KodeNegara == undefined)
          {
            alert('please fill country code ' + judul);
            return false;
          }

          if(KodeNegara.length == 0)
          {
            alert('please fill country code ' + judul);
            return false;
          }

          if (Number(NoTelp) == NaN)
          {
            alert(judul + ' must numeric');
            return false;
          }
          else{
            if(Number(NoTelp).toString() != NoTelp)
            {
              alert(judul + ' must numeric');
              return false;
            }
          }

        }
      }

      return true;
    }
    catch (err)
    {
      alert('Error CheckPhone : ' + err.message);
      return false;
    }
    
  }
  
  
  export function SetPhone(KodeArea, NoTelp)
  {
    try
    {
      if(NoTelp != undefined){
        if(NoTelp.length == 0)
        {
          return '';
        }
        else
        {
          return KodeArea + '-' + NoTelp;
        }
      }

    }
    catch (err)
    {
      alert('Error SetPhone : ' + err.message);
	  return '';
    }

  }
  
  export function GetCountryCode(NoTelp){
    try{
      
      if(NoTelp != undefined)
      {
        if(NoTelp.length > 0)
        {
          var lokasi = NoTelp.indexOf("-");
          return NoTelp.substring(0, lokasi);
          
        }
      }

    }
    catch (err)
    {
      alert('Error GetCountryCode : ' + err.message);
      return '';
    }
  }

  export function GetPhoneNo(NoTelp)
  {
    try{
      
      if(NoTelp != undefined){
        if(NoTelp.length > 0)
        {
          var lokasi = NoTelp.indexOf("-");
          return NoTelp.substring(lokasi + 1, NoTelp.length);
          
        }
      }

    }
    catch (err)
    {
      alert('Error GetPhoneNo : ' + err.message);
      return '';
    }
  }