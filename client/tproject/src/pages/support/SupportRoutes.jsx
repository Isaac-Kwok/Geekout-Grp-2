import { useContext, useEffect, createContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NotFound from '../errors/NotFound'
import http from '../../http'
import SupportHome from './SupportHome';
import CreateTicket from './CreateTicket';
import ViewTicket from './ViewTicket';
import ViewArticle from './ViewArticle';
import ViewArticles from './ViewArticles';

function SupportRoutes() {


    return (
        <>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<SupportHome />} />
                <Route path="/ticket/create" element={<CreateTicket />} />
                <Route path="/ticket/:id" element={<ViewTicket />} />
                <Route path="/articles" element={<ViewArticles />} />
                <Route path="/article/:id" element={<ViewArticle />} />
            </Routes>
        </>
    )
}

export default SupportRoutes