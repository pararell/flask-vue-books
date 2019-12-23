import xml.etree.ElementTree as ET
import xmltodict, json

def searchByQuery(xmldata):
    """
    A helper function that takes XML response content from Goodreads API search by query and returns
    a result list with book objects containing information about each book that matched query.
    Returns empty result list if no match is found.
    :param xmldata: XML response content from Goodreads API
    :return: result array with book objects
    """
    root = ET.fromstring(xmldata)
    result = []

    for item in root.iter('results'):
        for child in item:
            # create an empty book dictionary and populate with info from each result
            book = {}
            # get book info from XML response
            id = child.find("best_book").find("id").text
            title = child.find("best_book").find("title").text
            author = child.find("best_book").find("author").find("name").text
            img_url = child.find("best_book").find("image_url").text
            rating = child.find("average_rating").text
            ratingsCount = child.find("ratings_count").text
            publication_year = child.find("original_publication_year").text

            book['id'] = id if id else None
            book['title'] = title.replace("/", " ") if title else ''
            book['author'] = author if author else ''
            book['rating'] = rating if rating else ''
            book['ratingsCount'] = ratingsCount if ratingsCount else ''
            book['year'] = publication_year if publication_year else ''
            book['image'] = img_url if img_url else ''

            result.append(book)

    return result



def showBookApply(xmldata):
    jsonFormat = json.loads(json.dumps(xmltodict.parse(xmldata)))
    book = jsonFormat['GoodreadsResponse']['book'] if jsonFormat else {}

    author = book['authors']['author'][0]['name'] if isinstance(book['authors']['author'], list) else book['authors']['author']['name']

    book['bookId']  = book['id'] if book['id'] else ''
    book['author']  = author if author else ''
    book['pages']   = book['num_pages'] if book['num_pages'] else 0
    book['year']    = book['publication_year'] if book['publication_year'] else ''
    book['image']   = book['image_url'] if book['image_url'] else ''
    book['similarBooks'] = []
    similar_books = book.get('similar_books')

    if (similar_books and similar_books['book'] and len(similar_books['book'])):
        for item in similar_books['book']:

            author = item['authors']['author'][0]['name'] if isinstance(item['authors']['author'], list) else item['authors']['author']['name']

            item['title'] = item['title'].replace("/", " ") if item['title'] else ''
            item['author'] = author if author else ''
            item['image'] = item['image_url']
            item['rating'] = item['average_rating']
            item['year']  = item['publication_year']

            book['similarBooks'].append(item)

    return book



def detailBookApply(xmldata):

    root = ET.fromstring(xmldata)
    result = root.find('book')
    similarBooks = []
    reviews      = ''
    bookInfo     = {}
    rating = ''

    if (result.find("similar_books")):
        for item in result.find("similar_books"):
            # create an empty book dictionary and populate with info from each result
            book = {}
            # get book info from XML response
            id = item.find("id").text
            title = item.find("title").text
            author = item.find("authors").find('author').find('name').text
            img_url = item.find("image_url").text
            rating = item.find("average_rating").text
            year = item.find("publication_year").text

            book['id'] = id if id else None
            book['title'] = title.replace("/", " ") if title else ''
            book['author'] = author if author else ''
            book['image'] = img_url if img_url else ''
            book['rating'] = rating if rating else ''
            book['year']  = year if year else ''

            similarBooks.append(book)

    reviews = result.find('reviews_widget').text
    ratings_count = result.find('ratings_count').text
    rating = result.find('average_rating').text + ((' (' + ratings_count + ')') if ratings_count else '')

    bookInfo = { 'similarBooks': similarBooks, 'reviews': reviews, 'rating': rating  }

    return bookInfo