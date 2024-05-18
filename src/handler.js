const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request,h) =>{
    const { name, year, author, summary, publisher, 
        pageCount, readPage, reading,} 
    = request.payload;

    if(!name){
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    };

    if (pageCount < readPage) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response
    };

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    

    books.push({
        id: id,
        name: name,
        year: year,
        author: author,
        summary: summary,
        publisher: publisher,
        pageCount: pageCount,
        readPage: readPage,
        finished: finished,
        reading: reading,
        insertedAt: insertedAt,
        updatedAt: updatedAt
      });

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    };

    const response = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request,h) => {
    const {
        name, reading, finished
    } = request.query;

    let filteredBooks = [...books];
    
    if(name){
        filteredBooks = filteredBooks.filter( (book) => book
        .name.toLowerCase().includes(name.toLowerCase())  )
    };

    if(reading){
        filteredBooks = filteredBooks.filter((book) => book
        .reading === !!Number(reading))
    };

    if(finished){
        filteredBooks = filteredBooks.filter((book) => book
        .finished === !!Number(finished))
    };
    
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        },

    });
    response.code(200);

    return response;
};

const getBookByIdHandler = (request,h) => {
    const bookid = request.params.id;
    const book = books.filter((n) => n.id === bookid)[0];

    if(book){
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;

}

const editBookByIdHandler = (request,h) => {
    const bookId= request.params.id;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const index = books.findIndex((book) => book.id === bookId);
    if( index !== -1 ){
        if(!name){
            const response = h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            })
            response.code(400);
            return response;
        }

        if (pageCount < readPage) {
            const response = h.response({
              status: 'fail',
              message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        };

        const finished = (pageCount === readPage);
        const updatedAt = new Date().toISOString();

        books[index] = {
            ...books[index], name, year, author,
            summary, publisher, pageCount, readPage,
            reading, finished, updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;
}

const deleteBookByIdHandler = (request,h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books.splice(index,1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    });
    response.code(404);
    return response;

}

module.exports = {
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    addBookHandler,
    deleteBookByIdHandler,
};