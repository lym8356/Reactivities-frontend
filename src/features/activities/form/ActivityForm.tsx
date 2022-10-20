import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import CustomTextInput from "../../../app/common/form/CustomTextInput";
import CustomTextArea from "../../../app/common/form/CustomTextArea";
import CustomSelectInput from "../../../app/common/form/CustomSelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import CustomDateInput from "../../../app/common/form/CustomDateInput";
import { Activity } from "../../../app/models/activity";
import {v4 as uuid} from 'uuid';


function ActivityForm() {

    const history = useHistory();
    const { activityStore } = useStore();
    const { updateActivity, createActivity, loading, loadActivity, loadingInitial, setLoadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required.'),
        description: Yup.string().required('The activity description is required.'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required.').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    })

    useEffect(() => {
        if (id) {
            loadActivity(id).then(activity => setActivity(activity!))
        } else {
            setLoadingInitial(false);
        }
    }, [id, loadActivity, setLoadingInitial]);

    function handleFormSubmit(activity: Activity) {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <CustomTextInput name="title" placeholder="Title" />
                        <CustomTextArea rows={3} placeholder='Description' name="description" />
                        <CustomSelectInput
                            options={categoryOptions}
                            placeholder='Category'
                            name="category"
                        />
                        <CustomDateInput
                            placeholderText='Date'
                            name="date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color="teal" />
                        <CustomTextInput placeholder='City' name="city" />
                        <CustomTextInput placeholder='Venue' name="venue" />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} 
                            floated='right' 
                            positive type="submit" 
                            content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type="button" content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
}

export default observer(ActivityForm);

