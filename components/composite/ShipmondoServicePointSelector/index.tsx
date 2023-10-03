import classNames from "classnames"
import { FormEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { fetchServicePoints } from "components/data/ShipmondoServicePoint"
import { ButtonCss } from "components/ui/Button"
import { InputCss } from "components/ui/form/Input"

export type ShipmondoServicePoint = {
  number: string
  id: string
  company_name: string
  name: string
  address: string
  address2: string
  zipcode: string
  city: string
  country: string
  distance: number
  longitude: number
  latitude: number
  agent: string
  carrier_code: string
  opening_hours: [string]
  in_delivery: boolean
  out_delivery: boolean
}

interface ShipmondoServicePointSelectorProps {
  onCancel: () => void
  onSelect: (servicePoint: ShipmondoServicePoint) => void
}

export const ShipmondoServicePointSelector: React.FC<
  ShipmondoServicePointSelectorProps
> = ({ onCancel, onSelect }) => {
  const { t } = useTranslation()

  const [hasError, setHasError] = useState(false)
  const [postalCode, setPostalCode] = useState("")
  const [servicePoints, setServicePoints] = useState<ShipmondoServicePoint[]>(
    []
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setHasError(false)

    if (!postalCode || postalCode.length !== 4) {
      setHasError(true)
    } else {
      const shipmondoServicePoints = await fetchServicePoints(postalCode)
      if (shipmondoServicePoints.length === 0) {
        setHasError(true)
        setServicePoints([])
      } else {
        setServicePoints(shipmondoServicePoints)
      }
    }
  }

  return (
    <div>
      <ServicePointTitle>{t("servicePoint.title")}</ServicePointTitle>
      <form onSubmit={handleSubmit}>
        <ServicePointFormWrapper>
          <ServicePointFieldWrapper>
            <ServicePointFormPostalCodeInput
              className={classNames("form-input", { hasError })}
              required={false}
              placeholder={t("servicePoint.postalCode")}
              onChange={(event) => {
                setPostalCode(event.target.value)
              }}
            />
            <ServicePointFormPostalCodeSubmit>
              {t("servicePoint.search")}
            </ServicePointFormPostalCodeSubmit>
          </ServicePointFieldWrapper>
        </ServicePointFormWrapper>
        {servicePoints.length > 0 && (
          <ServicePointList>
            {servicePoints.map((servicePoint: ShipmondoServicePoint) => (
              <li key={servicePoint.id}>
                <button onClick={() => onSelect(servicePoint)}>
                  {servicePoint.name} (<SelectButton>select</SelectButton>)
                </button>
              </li>
            ))}
          </ServicePointList>
        )}
        <div>
          <CancelButton onClick={() => onCancel()}>
            {t("general.cancel")}
          </CancelButton>
        </div>
      </form>
    </div>
  )
}

const ServicePointTitle = styled.h2``

const ServicePointFormWrapper = styled.div`
  ${tw`pb-8 border-b`}
`
const ServicePointFieldWrapper = styled.div`
  ${tw`flex mt-1`}
`

const ServicePointFormPostalCodeInput = styled.input`
  ${InputCss}
  ${tw`rounded-none rounded-l-md z-10`}
  &.hasError {
    ${tw`placeholder-red-400 border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`
const ServicePointFormPostalCodeSubmit = styled.button`
  ${ButtonCss}
  ${tw`w-auto -ml-px relative space-x-2 px-8 py-3 border-transparent rounded-none rounded-r-md`}
`

const ServicePointList = styled.ul`
  ${tw`mb-4 border-b py-4`}
`

const CancelButton = styled.button`
  ${ButtonCss}
`
const SelectButton = styled.span`
  text-decoration: underline;
`
