'use client'

import { useEffect, useState } from 'react';
import { FaCopy, FaCheck, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { CiCirclePlus } from "react-icons/ci";
import { useMethodUrlContext } from '../context/MethodUrlContext';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdKey } from "react-icons/io";
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

function Request() {
    const { 
        params,
        headers,
        tokens,
        updateParams,
        updateHeaders,
        body,
        updateBody,
        updateTokens,
        aiRequest } = useMethodUrlContext();
  
    const [copied, setCopied] = useState(false);
    const [request, setRequest] = useState('Params');
    const [showToken, setShowToken] = useState(true);
    const [json, setJson] = useState(null);

    // useEffect(() => {
    //     if (aiRequest) {
    //         const startIndex = aiRequest.content.indexOf('{');
    //         const endIndex = aiRequest.content.lastIndexOf('}') + 1;
    //         const extractedJson = aiRequest.content.substring(startIndex, endIndex);

    //         try {
    //             const parsedJson = JSON.parse(extractedJson);
    //             setJson(JSON.stringify(parsedJson, null, 2));
    //         } catch (error) {
    //             console.error('Error parsing JSON:', error);
    //         }
    //     }
    // }, [aiRequest]);

    const handleCopy = () => {
        navigator.clipboard.writeText(body);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

const addField = () => {
    if (request === 'Params') {
        updateParams([...params, { name: '', value: '' }]);
    } else if (request === 'Headers') {
        updateHeaders([...headers, { name: '', value: '' }]);
    } else if (request === 'Auth') {
        updateTokens([...tokens, { name: '', value: ''}])
    }
};

const handleFieldChange = (index: number, field: string, value: string) => {
      if ((field == 'header' || field == 'auth' || field == 'param') && value === '') {
        console.error('Header name must be a non-empty string');
        return;
    }

    if (request === 'Params') {
        const updatedParams = [...params];
        updatedParams[index][field] = value;
        updateParams(updatedParams);
    } else if (request === 'Headers') {
        const updatedHeaders = [...headers];
        updatedHeaders[index][field] = value;
        updateHeaders(updatedHeaders);
    } else if (request === 'Auth') {
        const updatedTokens = [...tokens];
        updatedTokens[index][field] = value;
        updateTokens(updatedTokens);
    }
};

const deleteField = (index: number) => {
    if (request === 'Params') {
        const updatedParams = [...params];
        updatedParams.splice(index, 1);
        updateParams(updatedParams);
    } else if (request === 'Headers') {
        const updatedHeaders = [...headers];
        updatedHeaders.splice(index, 1);
        updateHeaders(updatedHeaders);
    } else if (request === 'Auth') {
        const updatedTokens = [...tokens];
        updatedTokens.splice(index, 1);
        updateTokens(updatedTokens);
    }
};
  
    const handleBodyChange = (value: any) => {
        updateBody(value);
    };
  
    return (
      <>
        <section className='border-2 border-gray-400 rounded-xl h-full p-5 w-1/2'>
            <p className='mb-5 text-xl font-bold text-white/90'>Request</p>
            <div className='min-w-[120px] max-w-[120px]'>
                
            </div>
  
            {(request === 'Params' || request === 'Headers' || request === 'Auth') ? (
              <div className='mt-5 p-3 rounded-xl overflow-y-scroll max-h-[400px] relative'>
                  {/* <Button onClick={addField} variant='alert' className='flex items-center gap-2 mb-[5px]'>
                  <p>
                    Add{' '}
                    {request === 'Params'
                        ? 'param'
                        : request === 'Headers'
                        ? 'header'
                        : request === 'Auth'
                        ? 'token'
                        : null}
                    </p>
                      <CiCirclePlus style={{ width: 25, height: 25 }} />
                  </Button> */}
                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="params">Params</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="auth">Auth</TabsTrigger>
                      <TabsTrigger value="body">Body</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                  </Tabs>


                  {((request === 'Params' && request !== 'Auth') ? params : headers).map((field, index) => (
                      <div className='flex items-center gap-3 mb-2' key={index}>
                          <input
                              className='p-2 rounded'
                              type='text'
                              placeholder='name'
                              value={field.name}
                              onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                          />
                          <input
                              className='p-2 rounded'
                              type='text'
                              placeholder='value'
                              value={field.value}
                              onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                          />
                          <FaTrash onClick={() => deleteField(index)} style={{ cursor: 'pointer' }} />
                      </div>
                  ))}

              </div>
          ) : null}

            {request === 'Auth' ? (
                <div className='mt-5 bg-gray-300 p-3 rounded-xl overflow-y-scroll max-h-[400px] relative flex flex-col gap-5'>
                    {tokens.map((token, index) => (
                        <div className='flex items-center gap-3' key={index}>
                            <IoMdKey />
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    key={index}
                                    className='p-2 rounded w-full'
                                    type={showToken ? 'text' : 'password'}
                                    placeholder='token'
                                    value={token.value}
                                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                />
                                {showToken ? (
                                    <FaEyeSlash 
                                        onClick={() => setShowToken(false)} 
                                        style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '10px', cursor: 'pointer' }} 
                                    />
                                ) : (
                                    <FaEye 
                                        onClick={() => setShowToken(true)} 
                                        style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '10px', cursor: 'pointer' }} 
                                    />
                                )}
                            </div>
                            <FaTrash onClick={() => deleteField(index)} style={{ cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
            ) : null}
  
            {request === 'Body' ? (
                <div className='mt-5 bg-gray-300 p-3 rounded-xl overflow-y-scroll max-h-[400px] relative'>
                    <CodeEditor
                        value={aiRequest ? json : body}
                        language="json"
                        placeholder="Write your JSON here"
                        onChange={(e) => handleBodyChange(e.target.value)}
                        padding={15}
                        style={{
                            backgroundColor: "#f5f5f5",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                    <button onClick={handleCopy} className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
                        {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </div>
            ) : null}
        </section>

        <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
      </>
    );
}

export default Request;