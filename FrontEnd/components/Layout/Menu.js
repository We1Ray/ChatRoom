import React, { useState, useEffect, useContext, useRef, useImperativeHandle, forwardRef } from "react"
import ContentWrapper from '@/components/Layout/ContentWrapper';
import { Row, Col, Card, CardBody, CardFooter, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';


export default function Menu() {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const ContactCard = props => (
        <Col sm="4">
            <Card className="card-default">
                <CardBody className="text-center">
                    <img className="mb-2 img-fluid rounded-circle thumb64" src={props.imgsrc} alt="Contact" />
                    <h4>{props.name}</h4>
                    <p>{props.desc}</p>
                </CardBody>
                <CardFooter className="d-flex">
                    <div>
                        <button type="button" className="btn btn-xs btn-primary">Send message</button>
                    </div>
                    <div className="ml-auto">
                        <button type="button" className="btn btn-xs btn-secondary">View</button>
                    </div>
                </CardFooter>
            </Card>
        </Col>
    )

    return (
        <ContentWrapper>
            <Row>
                <ContactCard imgsrc="/static/img/user/02.jpg" name="Audrey Hunt" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/03.jpg" name="Leonard Price" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/04.jpg" name="Jamie Stephens" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/05.jpg" name="Tara Nelson" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/06.jpg" name="Constance Cook" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/07.jpg" name="Laura Palmr" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/08.jpg" name="Audrey Hunt" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/09.jpg" name="Leslie Mckinney" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
                <ContactCard imgsrc="/static/img/user/04.jpg" name="Brian Mills" desc="Hello, I'm a just a dummy contact in your contact list and this is my presentation text. Have fun!" />
            </Row>
        </ContentWrapper>
    )

}