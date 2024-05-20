import DataTable from '../../components/datatable/DataTable'
import './list.scss'
import { useState, useEffect } from 'react';

function List(){
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch("https://mybanda-backend-88l2.onrender.com/users")
            .then(resp => resp.json())
            .then((data) => {
                const filteredData = data.filter(user => user.role === 'seller');
                setUserData(filteredData);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    console.log("userData", userData)

    return(
        <div className='adminList'>
            <div className="listContainer">
                <DataTable rows={userData} role="seller"/>
            </div>
        </div>
    )
}

export default List;

