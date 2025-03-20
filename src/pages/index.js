import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { mixed, number, object } from 'yup';
import { Typography } from '@material-ui/core';

const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            education: '',
            university: '',
            skills: '',
            experience: '',
            hobbies: ''
          }}
          onSubmit={async (values) => {
            await sleep(3000);
            console.log('values', values);
          }}
        >
          <FormikStep label="Personal Data">
            <Box paddingBottom={2}>
              <Field fullWidth name="firstName" component={TextField} label="First Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="lastName" component={TextField} label="Last Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="millionaire"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{ label: 'I am a millionaire' }}
              />
            </Box>
          </FormikStep>

          <FormikStep
            label="Contact Information"
          >
            <Box paddingBottom={2}>
              <Field fullWidth name="email" component={TextField} label="Email Address" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="phone" component={TextField} label="Phone Number" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="address" component={TextField} label="Address" />
            </Box>
          </FormikStep>

          <FormikStep
            label="Location Details"
          >
            <Box paddingBottom={2}>
              <Field fullWidth name="city" component={TextField} label="City" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="country" component={TextField} label="Country" />
            </Box>
          </FormikStep>

          <FormikStep
            label="Education & Skills"
          >
            <Box paddingBottom={2}>
              <Field fullWidth name="education" component={TextField} label="Highest Education" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="university" component={TextField} label="University/Institution" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="skills" component={TextField} label="Skills" />
            </Box>
          </FormikStep>

          <FormikStep
            label="Additional Information"
            validationSchema={object({
              money: mixed().when('millionaire', {
                is: true,
                then: number()
                  .required()
                  .min(
                    1000000,
                    'Because you said you are a millionaire you need to have 1 million'
                  ),
                otherwise: number().required(),
              }),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="money"
                type="number"
                component={TextField}
                label="All the money I have"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="experience" component={TextField} label="Work Experience" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="hobbies" component={TextField} label="Hobbies" />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export function FormikStep({ children, label, validationSchema }) {
  return <>{children}</>;
}

export function FormikStepper({ children, ...props }) {
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Box marginBottom={2}>
            <Typography variant="h6" align="center">
              Step {step + 1} of {childrenArray.length}
            </Typography>
          </Box>
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="secondary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
