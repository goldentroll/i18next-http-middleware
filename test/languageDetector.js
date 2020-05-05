import expect from 'expect.js'
import i18next from 'i18next'
import LanguageDetector from '../lib/LanguageDetector.js'

i18next.init()

describe('language detector', () => {
  const ld = new LanguageDetector(i18next.services, { order: ['session', 'querystring', 'cookie', 'header'] })

  describe('cookie', () => {
    it('detect', () => {
      const req = {
        headers: {
          cookie: 'i18next=de'
        }
      }
      const res = {}
      const lng = ld.detect(req, res)
      expect(lng).to.eql('de')
      expect(res).to.eql({})
    })

    it('cacheUserLanguage', () => {
      const req = {}
      const res = { h: {} }
      res.header = (name, value) => { res.h[name] = value }
      ld.cacheUserLanguage(req, res, 'it', ['cookie'])
      expect(req).to.eql({})
      expect(res).to.have.property('h')
      expect(res.h).to.have.property('Set-Cookie')
      expect(res.h['Set-Cookie']).to.match(/i18next=it/)
      expect(res.h['Set-Cookie']).to.match(/Path=\//)
    })
  })

  describe('header', () => {
    it('detect', () => {
      const req = {
        headers: {
          'accept-language': 'de'
        }
      }
      const res = {}
      const lng = ld.detect(req, res)
      expect(lng).to.eql('de')
      expect(res).to.eql({})
    })
  })

  describe('path', () => {
    it('detect', () => {
      const ld = new LanguageDetector(i18next.services, { order: ['path', 'session', 'querystring', 'cookie', 'header'] })
      const req = {
        originalUrl: '/de/some/route'
      }
      const res = {}
      const lng = ld.detect(req, res)
      expect(lng).to.eql('de')
      expect(res).to.eql({})
    })
  })

  describe('querystring', () => {
    it('detect', () => {
      const req = {
        url: '/fr/some/route?lng=de'
      }
      const res = {}
      const lng = ld.detect(req, res)
      expect(lng).to.eql('de')
      expect(res).to.eql({})
    })
  })

  describe('session', () => {
    it('detect', () => {
      const req = {
        session: {
          lng: 'de'
        }
      }
      const res = {}
      const lng = ld.detect(req, res)
      expect(lng).to.eql('de')
      expect(res).to.eql({})
    })

    it('cacheUserLanguage', () => {
      const req = {
        session: {
          lng: 'de'
        }
      }
      const res = {}
      ld.cacheUserLanguage(req, res, 'it', ['session'])
      expect(req).to.have.property('session')
      expect(req.session).to.have.property('lng', 'it')
      expect(res).to.eql({})
    })
  })
})
