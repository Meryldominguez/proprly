// import React, {useState} from 'react'
// import querystring from "querystring"

// import { 
//     Button,
//     Form,
//     FormGroup,
//     FormControl,
//     InputGroup,
//     Col
//  } from 'react-bootstrap'
 
// const SearchForm = ({search}) => {
//     const [formData, setFormData] = useState(
//         {
//             name:""
//         });

//     const handleSubmit = async (evt)=> {
//         evt.preventDefault();
//         formData.name !=="" ?
//             search(`?${querystring.stringify(formData)}`)
//             :search("")
//       };

//     const handleChange = evt => {
//         const {name,value} = evt.target;
//         setFormData({
//             ...formData,
//             [name]:value,
//         });
//     };
//   return (
//     <Form onSubmit={handleSubmit}>
//         <Col>
//         <FormGroup> 
//             <InputGroup className="mb-3">
//                 <FormControl
//                 placeholder="..."
//                 aria-label="Search companies"
//                 aria-describedby="basic-addon2"
//                 name="name"
//                 value={formData.search}
//                 onChange={handleChange}
//                 />
//                 <InputGroup.Append>
//                     <Button onClick={handleSubmit} variant="outline-secondary" >
//                         Search
//                     </Button>
//                 </InputGroup.Append>
//             </InputGroup>
//         </FormGroup>
//         </Col>
//     </Form>
//   )
// }
 
// export default SearchForm