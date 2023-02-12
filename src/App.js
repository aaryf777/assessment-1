import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import debounceWrapper from './debounce';
import List from './List';

function App() {
  const [filterList, setFilterList] = useState([]);
  const [loading, setloading] = useState(false)
  const [query, setQuery] = useState('');
  const [select, setSelect] = useState(0);
  const [keyPress, setKeyPress] = useState({
    code : '',
    toggle: true
  });
  const listRef = useRef([])
  const debounce = useCallback(debounceWrapper(),[])
  
  async function getData(query) {
    let res = await fetch('http://www.mocky.io/v2/5ba8efb23100007200c2750c');
    let data = await res.json();
    let fData = data.filter(ele => (
    ele.name.toLowerCase().indexOf(query.toLowerCase()) > -1 
    || ele.address.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.id.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.pincode.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.items.includes(query)
    )).map(ele => ({...ele,found: ele.items.filter(x => x === query)  }))
    setFilterList(fData)
    setloading(false);
  }

  
  useEffect(() => {
    const handleKeyup = e => {
       if(e.code === 'ArrowDown') { 
        setKeyPress({code:'down',toggle: !keyPress.toggle});
       } else if(e.code === 'ArrowUp') { 
        setKeyPress({code:'up',toggle: !keyPress.toggle});
      }
      
    }
    document.addEventListener('keydown', handleKeyup )
    return () => {
      document.removeEventListener('keydown',()=>{console.log('removing listner')})
    }

  },[])

  useEffect(() => {
    keyPress.code === 'down' &&  setSelect(select < filterList.length-1 ? select+1 : select)
    keyPress.code === 'up' && setSelect(select > 0 ? select-1 : select)
    listRef.current[select]?.scrollIntoView({ behavior: 'smooth' })
  },[keyPress])
 

  useEffect(() => {
    if(query.length){
      setloading(true);
      debounce(getData,1000,query);
    }
  },[query])
  

  return (
    <div className="App">
      <input type='search' placeholder='search list' value={query} onChange={e  => setQuery(e.target.value)}/>
      
      { !!query.length && (
         loading ? <>Loading....</> : filterList.length ? <div className='list'>
            {
              filterList.map((item,i) => <div ref={(el) => (listRef.current[i] = el)} key={item.id} className='item'   onMouseMove={(e) => {setSelect(i);listRef.current[select].scrollIntoView({ behavior: 'smooth' })}} style={{background : item.id === filterList[select]?.id ? 'lightgray':''}}>
               {
                Object.entries(item).map((ele) =>  <List item = {ele} query={query} i ={i}/>)
               }
              </div>)
            }
        </div>
        : <div className='nodata'>No data found</div>)
      }
    </div>
  );
}

export default App;
