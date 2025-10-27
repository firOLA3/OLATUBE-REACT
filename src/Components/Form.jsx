import { useFormik } from 'formik'
import React from 'react'
import * as yup from 'yup'


const Form = () => {
    let formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        onSubmit: (values) => {
            console.log(values)
        },
        validationSchema: yup.object({
            firstName: yup.string("Input your first Name").required("First Name is Required"),
            lastName: yup.string("Enter your last Name").required("Last Name is Required"),
            email: yup.string("Input your email Name").required("First Name is Required").email("Email must be valid"),
            password: yup.string("Fill in your password").required("First Name is Required")
        })
    })
    console.log(formik.errors);



  return (
    <>
        <h1>Form Components</h1>
            <input type="text" name='firstName' onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {
                formik.touched.firstName && formik.errors.firstName ? <tt>{formik.errors.firstName}</tt> : ""
            }

            <input type="text" name='lastName' onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {
                formik.touched.lastName && formik.errors.lastName ? <tt>{formik.errors.lastName}</tt> : ""
            }

            <input type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {
                formik.touched.email && formik.errors.email ? <tt>{formik.errors.email}</tt> : ""
            }

            <input type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {
                formik.touched.password && formik.errors.password ? <tt>{formik.errors.password}</tt> : ""
            }
            <button type='button' onClick={formik.handleSubmit}>Submit</button>
    </>
  )
}

export default Form
