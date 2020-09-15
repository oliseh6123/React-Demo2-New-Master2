import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react';
import { useFormContext, Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Modal,
  Card,
  Tab,
  Tabs,
  Button
} from 'react-bootstrap';
// import {Panel} from 'primereact/panel';
import moment from 'moment';
import Select from "../../Shared/Select";
import Datepicker from "../../Shared/Datepicker";
// import Highlights from "../../Tooltips/Highlights";
// import "../../Shared/style.css"

// Data from JSON file
import criteriaJson from '../../Dummy/ic4pro_finCrteria.json';
import currencyJson from '../../Dummy/ic4pro_currency.json';
import worksheets from '../../Dummy/ic4pro_auditworksheets.json';
//import designatesJson from '../../Dummy/ic4pro_designates.json';

{/*const years = new Array(25 + 1).fill().map((e,i) => {
  return {label: i, value: i}
});

const months = new Array(10 + 1).fill().map((e,i) => {
  return {label: i, value: i}
});  */}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StepSeven = () => {
  const { register, errors, control, handleInput,setValue, getValues, reset, selectedData, mode } = useFormContext();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [shows, setShows] = useState(false);

  const handleModal = () => setShows(prev => !prev);



  const { fields: financialHighLightsFields, append: financialHighLightsAppend, remove: financialHighLightsRemove } = useFieldArray({
    control,
    name: "financialHighLights"
  });

  const { fields: currencyFields, append: currencyAppend, remove: currencyRemove } = useFieldArray({
    control,
    name: "currency"
  });

  const { fields: highlightsFields, append: highlightsAppend, remove: highlightsRemove } = useFieldArray({
    control,
    name: "highlights"
  });

  const { fields: sourcesFields, append: sourcesAppend, remove: sourcesRemove } = useFieldArray({
    control,
    name: "sources"
  });


  const [ users, setUsers ] = useState([...criteriaJson])

  const [ currency, setCurrency ] = useState([...currencyJson])

  const [ percentAchieved, setPercentAchieved ] = useState(null); 

  const watchFinancialHighLights = useWatch({ name:'currencyCode', name: 'financialHighLights' });
  const watchCurrencyCode = useWatch({ name: 'currencyCode' });

  const watchBranchId = useWatch({ name: 'branchId' });

  const isInitiated = useRef(false);

  useEffect(() => {
    if(mode === 'create') {
      reset({
        ...getValues(),
        financialHighLights: [{}]
      })
    }
  }, [getValues, mode, reset])

  // useEffect(() => {
  //   if(mode === 'create'){
  //       financialHighLightsAppend();
  //       sourcesAppend();
  //   }
  // }, [financialHighLightsAppend, sourcesAppend])


  const handleChange = date => {

    console.log("sourceDate:",moment(getValues("sourceDate"), 'DD/MM/YYYY').toDate())
    console.log("today:",moment(getValues("today"), 'DD/MM/YYYY').toDate())
  
    if (moment(getValues("today"), 'DD/MM/YYYY').toDate() > moment(getValues("sourceDate"), 'DD/MM/YYYY').toDate()){
     setValue("today","")
      setShow(true)
    }
      
  
};

const worksheetsFiltered = React.useMemo(() => {
  const newWorksheets = worksheets.filter(dt => dt.branchId === watchBranchId?.branchId)[0];
  return newWorksheets;
}, [watchBranchId]);




  const worksheetsFinFiltered = React.useMemo(() => {
    const newWorksheets = worksheets.map(dt =>
      (dt.financialHighLights.filter(fh => fh.finCriteria === watchFinancialHighLights?.financialHighLights?.finCriteria))
      )
    return newWorksheets;
  }, [watchFinancialHighLights]);



useEffect (() => {
  if(watchFinancialHighLights) {
    console.log("watchFinancialHighLights:",watchFinancialHighLights)
    // const branchRatingsCount = watchBranchRatings.length;
    const finActualSum  = watchFinancialHighLights.reduce((acc, curr) => acc + parseFloat(curr.finActual || 0),0)
    const finBudgetSum  = watchFinancialHighLights.reduce((acc, curr) => acc + parseFloat(curr.finBudget || 0),0)
    setPercentAchieved((finActualSum / finBudgetSum )*100)

  }
}, [watchFinancialHighLights])


  useEffect(() => {
    if(!isInitiated.current && selectedData && (mode !== 'create' || mode === null)) {
      reset({
        ...getValues(),
        financialHighLights: selectedData.financialHighLights.map(sd => ({
        finCriteria: users.find(uj => uj.criteria === sd.finCriteria),
        finActual: sd.finActual,
        finBudget: sd.finBudget,
        percentAchieved: sd.percentAchieved
          //datejoin: moment(sd.datejoin, 'YYYYMMDD').toDate(),
          //jobStayYear: years.find(y => y.value === parseInt(sd.jobStayYear)),
         // jobStayMonth: months.find(m => m.value === parseInt(sd.jobStayMonth)), 
        })),
        sources: selectedData.sources.map(rv => ({
        sourceDate: moment(rv.sourceDate, 'YYYYMMDD').toDate(),
    }))
    })
    isInitiated.current = true;
  }
}, [getValues, mode, reset, selectedData, users])



  




 
  const watchSources = useWatch({ name: 'sources' });
  const prevWatchFinancialHighLights = usePrevious(watchFinancialHighLights);

//  useEffect(() => {
//     if(watchFinancialHighLights && !compare(watchFinancialHighLights, prevWatchFinancialHighLights)) {
//       setUsers(prevUsers => {
//         const newwatchFinancialHighLights= watchFinancialHighLights.map(fh => fh.finCriteria?.criteria);
//         const newUsers = prevUsers?.map(u => ({ ...u, isDisabled: newwatchFinancialHighLights.includes(u.criteria) }))
//         return newUsers;
//       })
//     }
//   }, [prevWatchFinancialHighLights, watchFinancialHighLights, users]) 
  
  // const getCurrency = useCallback((currencyCode) => {
  //   const currencyFind = currencyJson.find(cj => cj.currencyCode === currencyCode)
  //   return currencyFind?.currencyDescription;
  // }, []);


//   const header = (
//     <>
//     <div >  
//       <div>Financial Highlights <Highlights/></div>
//     </div>
//   </>
//   )

//   const header1 = (
//     <>
//     <div >  
//       <div>Financial Source <Highlights/></div>
//     </div>
//   </>
//   )
  
  const getVariance = (actual, budget) => (actual - budget)

  const getPercentAchieved = (actual, budget) => (actual / budget) * 100;

  const customFinancialHighLightsRemove = (currencyIndex, criteriaIndex) => {
    let newCurrency = watchCurrencyCode;
    newCurrency[currencyIndex] = {
      ...newCurrency[currencyIndex],
      financialHighLights: newCurrency[currencyIndex].financialHighLights.filter((dt, index) => index !== criteriaIndex)
    }
    reset({
      ...getValues(),
      currencyCode: newCurrency
    })
  }
 
  return (
    <Fragment>
      <Card>
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Financial Highlights
        </Card.Header>
        <Card.Body>
      {highlightsFields.map((item, currencyIndex) => (
        <div controlId={`highlightsField.[${currencyIndex}]`}>
      
        <div >
          <Form inline controlId={`currencyCode[${currencyIndex}].currencyCode`}>
            <Form.Label className="my-1 mr-3 mb-1" style={{marginTop:0}} htmlFor="currency">
              Currency
            </Form.Label>
            <Col sm="3">
            <Controller
                name={`currencyCode[${currencyIndex}].currencyCode`}
                as={Select}
                options={currency}
                control={control}
                getOptionValue={option => option.currencyCode}
                getOptionLabel={option => option.currencyCode}
                readOnly
              />
            </Col>
            
            {/* <Col xs="auto">
              <Button variant="primary" onClick={handleModal} size="sm" style ={{height:'1.8rem', marginTop:0,}} disabled={!worksheetsFiltered?.worksheetId}>Detail</Button>
            </Col> */}
            
            <Form.Control
                type="text"
                name={`currencyCode[${currencyIndex}].currencyDescription`}
                style ={{height:'1.8rem', marginTop:0}} 
                defaultValue= {watchCurrencyCode?.[currencyIndex]?.currencyCode?.currencyDescription}
                readOnly
                className="my-1 mr-3 sm-2"
              />
              <Col sm="1">
              <Button variant="danger"  size="sm" style ={{height:'1.8rem', marginTop:0,}} onClick={() => highlightsRemove(currencyIndex)}>Delete</Button>
              </Col>
          </Form>
          </div>
         
          
        
                
                <Form.Group as={Row} className="mt-5">
                
                
                {/* <Form.Label column sm={2} >
                  Currency
                </Form.Label> */}
                
                <Form.Label as={Col} sm="3">
                  Criteria
                </Form.Label>
                
                <Form.Label as={Col} sm="2">
                  Actual (x 1000)
                </Form.Label>
                 
                <Form.Label as={Col} sm="2" className="ml-2">
                  Budget (x 1000)
                </Form.Label>

                <Form.Label as={Col} sm="2" className="ml-2">
                  Variance (x 1000)
                </Form.Label>
                
                
                <Form.Label as={Col} sm="2" className="ml-2">
                  (%) Achieved
                </Form.Label>
                

                <Form.Label as={Col} >
                  
                </Form.Label>
                {/* <Form.Label column xs={2}  >
                  Last Audit
                </Form.Label> */}
                
               {/* <Form.Label column sm={2}  >
                  Job Month
                 </Form.Label> */}
                </Form.Group>
                
                

         {financialHighLightsFields.map((item2, criteriaIndex) => (
            <>
         <Row key={item.id}> 
              <Form.Group as={Col} sm="3" >
              
                <Controller
                  
                  name={`currencyCode[${currencyIndex}].financialHighLights[${criteriaIndex}].finCriteria`}
                  as={Select}
                  options={users}
                  control={control}
                  getOptionValue={option => option.criteria}
                  getOptionLabel={option => option.description}
                  rules={{ required: 'Criteria is required!' }}
                  // isInvalid={errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finCriteria}
                  
                />
               
              </Form.Group>

              {/* <Form.Group as={Col} controlId={`financialHighLights[${index}].currencyCode`}>
                
              <Form.Control
                  name={`financialHighLights[${index}].currencyCode`}
                  id="currencyCode"
                  type="text"
                  ref={register}
                  defaultValue= {getCurrency(watchFinancialHighLights?.[index]?.finCriteria?.currencyCode)} 
                  style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                  readOnly 
                  isInvalid={errors.financialHighLights?.[index]?.finCurrency} />
              </Form.Group> */}
              
              <Form.Group as={Col} >
              
                <Form.Control 
                
                name= {`currencyCode[${currencyIndex}].financialHighLights[${criteriaIndex}].finActual`}
                type="number"
                //options={scores}
               
                style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                // isInvalid={errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finActual}
                ref={register({
                  required: 'Fin Actual is required!',
                  min: {
                    value: 0,
                    message: 'Minimum value is 0!'
                  },
                  max: {
                    value: 100,
                    message: 'Max value is 100!'
                  }
                })}
                
              />
               
              {/* <Form.Control.Feedback type="invalid">
                  {errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finActual?.message}
                </Form.Control.Feedback> */}
              </Form.Group>
              
              
              
              <Form.Group as={Col} >
              
                <Form.Control
                  name= {`currencyCode[${currencyIndex}].financialHighLights[${criteriaIndex}].finBudget`}
                  type="number"
                //options={scores}
                style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                
                // isInvalid={errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finBudget}
                ref={register({
                  required: 'Fin Budget is required!',
                  min: {
                    value: 1,
                    message: 'Minimum value is 0!'
                  },
                  max: {
                    value: 100,
                    message: 'Max value is 100!'
                  }
                })}
                
              />
              {/* <Form.Control.Feedback type="invalid">
                  {errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finBudget?.message}
                </Form.Control.Feedback> */}
              </Form.Group>
              
              <Form.Group as={Col} >
              
              <Form.Control
                name={`currencyCode[${currencyIndex}].financialHighLights[${criteriaIndex}].variance`}
                
                type="number"
                disabled
                value={getVariance(watchCurrencyCode?.[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finActual, watchCurrencyCode?.[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finBudget)}
                style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                // isInvalid={errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.variance}
                ref={register}
                
              />
              {/* <Form.Control.Feedback type="invalid">
                  {errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.variance?.message}
                </Form.Control.Feedback> */}
              </Form.Group>

              <Form.Group as={Col} >
              
              <Form.Control
                name={`currencyCode[${currencyIndex}].financialHighLights[${criteriaIndex}].percentAchieved`}
                
                type="number"
                disabled
                // value={getPercentAchieved(watchFinancialHighLights?.[criteriaIndex]?.finActual, watchFinancialHighLights?.[criteriaIndex]?.finBudget)}
                value={getPercentAchieved(watchCurrencyCode?.[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finActual, watchCurrencyCode?.[currencyIndex]?.financialHighLights?.[criteriaIndex]?.finBudget)}
                style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                // isInvalid={errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.percentAchieved}
                ref={register}
                
                
              />
              {/* <Form.Control.Feedback type="invalid">
                  {errors.currencyCode[currencyIndex]?.financialHighLights?.[criteriaIndex]?.percentAchieved?.message}
                </Form.Control.Feedback> */}
              </Form.Group>

                <Form.Group as={Col} style={{marginTop:0, maxHeight:'1.8rem'}} controlId={`financialHighLights[${criteriaIndex}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" size="sm" onClick={() => customFinancialHighLightsRemove(currencyIndex, criteriaIndex)} style={{marginTop: 0, maxHeight:'1.8rem'}}>Delete</Button>
                </Form.Group>
              
            </Row>
            
            </>
          ))}


          <Form.Group as={Row}>
          <Col>
           <Row>
            <Button variant="primary" size="sm" style={{maxWidth:'7rem', maxHeight:'1.8rem', marginRight:"10px", marginLeft:"8px"}} type="button" onClick={financialHighLightsAppend}>Add Criteria </Button>
            <Button variant="success" onClick={handleModal} size="sm" style ={{maxWidth:'10rem', height:'1.8rem'}}>Last Financial Audit</Button>
            </Row>
          </Col>
          </Form.Group>
          </div>
            ))}
          <Col sm="2" className="mt-3">
            <Row>
              <Button variant="primary"  size="sm" style ={{height:'1.8rem', marginTop:0,}} onClick={highlightsAppend}>Add Highlights</Button>
              {/* <Button variant="danger"  size="sm" style ={{height:'1.8rem', marginTop:0,}} >Delete Highlights</Button> */}
            </Row>
            </Col>
            </Card.Body>
      </Card>

      <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Financial Source
        </Card.Header>
        <Card.Body>
        
        <Row>
          <Form.Group as={Col} md="7">
                 <Form.Label >
                  Source Name 
                </Form.Label>
                </Form.Group>
                <Form.Group as={Col} md="4">    
                <Form.Label>
                  Source Date
                </Form.Label>
                </Form.Group>
           </Row>
        {/*<Col>
          <Form.Group as={Row} md="11">
                 <Form.Label>
                  Financial Highlights 
                </Form.Label>
                </Form.Group>
         </Col> */}
          {sourcesFields.map((item, index) => (
            <>
            <Row key={item.id}>

            <Form.Group as={Col} md="7" controlId = {`sources[${index}].sourceName`}>
            
              <Form.Control  
                name={`sources[${index}].sourceName`}
                type="text"
                ref={register}
                style ={{height:'1.8rem', marginTop:0, marginBottom:0}}
                //readOnly
                isInvalid={errors.sources?.[index]?.sourceName}
                />
               
         </Form.Group>
         <Form.Group as={Col} md="3" controlId={`sources[${index}].sourceDate`}>
               
                <Controller
                  control={control}
                  name={`sources[${index}].sourceDate`}
                  rules={{ required: 'Source Date is required!' }}
                  render={({ onChange, onBlur, value }) => (
                    <Fragment>
                      <Datepicker
                        onChange={onChange}
                        onBlur={onBlur}
                        selected={value}
                       isInvalid={errors.sources?.[index]?.sourceDate}
                        className="form-control is-invalid"
                        placeholderText="Source Date..."
                        dateFormat="dd/MM/yyyy"
                        //defaultValue={moment().format('DD/MM/YYYY')}
                      />
                    </Fragment>
                  )}
                />
              
              </Form.Group>
              <Form.Group as={Col} style={{marginTop:0, maxHeight:'1.8rem'}} controlId={`sources[${index}].delete`}
                  className="d-flex align-items-center justify-content-center" xs="auto"
                >
                  <Button variant="danger" onClick={() => sourcesRemove(index)} style={{marginTop:0, maxHeight:'1.8rem'}}>Delete</Button>
                </Form.Group> 
              
      
            
            </Row>
            <Row>
           
        <Form.Group as={Col} md="11" controlId={`sources[${index}].finHighlights`} >
            <Form.Control
              as="textarea"
              contentEditable
              //textareaHeight ="38"
              rows="5"
              className="hidden"
              //inputStyle ={{width:'4000px'}}
              name={`sources[${index}].finHighlights`}
              ref={register}
              isInvalid={errors.sources?.[index]?.finHighlights}
              placeholder="Financial Highlights..."
            />
            
          </Form.Group>
          
           
          
          </Row>
            </>
          ))}

{/* <Form.Group as={Col} controlId="percentAchieved">
                
                <Form.Control
                    name="percentAchieved"
                    id="percentAchieved"
                    type="number"
                    value={percentAchieved}
                    disabled
                  style ={{height:'1.8rem', marginTop:0, marginBottom:0}} 
                  
                  ref={register}
                  
                  
                />
                <Form.Control.Feedback type="invalid">
                    
                  </Form.Control.Feedback>
                </Form.Group> */}
          <Form.Group>
            <Button variant="primary" size="sm" style={{maxWidth:'7rem', maxHeight:'1.8rem'}} type="button" onClick={sourcesAppend}>Add Source</Button>
          </Form.Group>
          </Card.Body>
      </Card>

          <Modal
        show={shows}
        onHide={handleModal}
        keyboard={false}
        centered
        dialogClassName="modal-91w"
        size="xl"
      >
        <Modal.Header style={{ backgroundColor: '#8C00FF', padding:'3px', height: '2.9rem' }}>
          <Modal.Title className="text-capitalize text-light">
            <h5>Detail of {worksheetsFiltered?.worksheetId}</h5>
          </Modal.Title>
          <Button
            variant="success"
            size="sm"
            className="border border-white "
            onClick={handleModal}
            
          >
            Cancel
          </Button>
        </Modal.Header>
        <Modal.Body>
        <Tabs>
          
          
          
          
          <Tab eventKey="highlights" title="Highlights">
          
          <Card className="mt-3">
        <Card.Header className="font-weight-bold" style={{ backgroundColor: '#FFC107' }}>
          Financial Highlights
        </Card.Header>
        <Card.Body>

          

          <Form.Group as={Row} >
                <Form.Label column sm={4} style={{paddingLeft:"2rem"}}>
                  Criteria
                </Form.Label>
              
                <Form.Label column sm={2} >
                Actual (x 1000)
                </Form.Label>
                
                <Form.Label column sm={2} className='text-center'>
                  Budget (x 1000)
                </Form.Label>
                
                <Form.Label column sm={3} className='text-center'>
                  (%) Achieved
                </Form.Label>
              
                </Form.Group>
                {worksheetsFiltered?.financialHighLights.map((br, index) => (
                  <Row key={index}>
                  <Form.Group as={Col} sm="3" controlId={`lastAuditVisitBranchRatingsBranchUnit${index}`}>
                  
                  <Form.Control
                    type="text"
                    defaultValue={br.finCriteria}
                    style ={{height:'1.8rem'}}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3" controlId={`lastAuditVisitBranchRatingsUnitScore${index}`}>
                  
                  <Form.Control
                    type="text"
                    defaultValue={br.finActual}
                    style ={{height:'1.8rem'}}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3" controlId={`lastAuditVisitBranchRatingsUnitGrade${index}`}>
                  
                  <Form.Control
                    type="text"
                    defaultValue={br.finBudget}
                    style ={{height:'1.8rem'}}
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3" controlId={`lastAuditVisitBranchRatingsInterpretation${index}`}>
                  
                  <Form.Control
                    type="text"
                    defaultValue={br.percentAchieved}
                    style ={{height:'1.8rem'}}
                    readOnly
                  />
                </Form.Group>
                </Row>
                ))}

</Card.Body>
      </Card>

         

          </Tab>

         
          </Tabs>
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(StepSeven, compare);